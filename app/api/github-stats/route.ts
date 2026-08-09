import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const API_HEADERS = { Accept: "application/vnd.github+json" };

const DAY_MS = 24 * 60 * 60 * 1000;
const ONE_YEAR_MS = 365 * DAY_MS;
const UPSTREAM_CACHE_SECONDS = 60 * 60 * 24; // 1 day

interface StatsPayload {
  handle: string;
  repos: number;
  languages: number | null;
  yearsActive: number;
  commits: number | null;
  commitsRecent: number | null;
  totalContributions: number | null;
  currentStreak: number | null;
  longestStreak: number | null;
  source: "graphql" | "rest";
}

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface GqlCalendar {
  totalContributions?: number;
  weeks?: Array<{ contributionDays?: ContributionDay[] }>;
}

interface GraphqlUserResponse {
  user: {
    repositories?: {
      totalCount?: number;
      nodes?: Array<{ primaryLanguage?: { name?: string } | null } | null>;
    };
    [alias: string]: unknown;
  } | null;
}

const toDateStr = (time: number) => new Date(time).toISOString().slice(0, 10);

const shiftDay = (date: string, days: number) =>
  toDateStr(new Date(`${date}T00:00:00Z`).getTime() + days * DAY_MS);

/** Total count from the commit search API (fail-soft: null on rate limit / error). */
const fetchCommitCount = async (query: string): Promise<number | null> => {
  try {
    const res = await fetch(
      `${GITHUB_API}/search/commits?q=${encodeURIComponent(query)}&per_page=1`,
      { headers: API_HEADERS, next: { revalidate: UPSTREAM_CACHE_SECONDS } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { total_count?: number };
    return typeof data.total_count === "number" ? data.total_count : null;
  } catch {
    return null;
  }
};

/** Count of distinct primary languages across public repos (fail-soft). */
const fetchLanguageCount = async (handle: string): Promise<number | null> => {
  try {
    const res = await fetch(`${GITHUB_API}/users/${handle}/repos?per_page=100`, {
      headers: API_HEADERS,
      next: { revalidate: UPSTREAM_CACHE_SECONDS },
    });
    if (!res.ok) return null;
    const repos = (await res.json()) as Array<{ language?: string | null }>;
    if (!Array.isArray(repos)) return null;
    const languages = repos
      .map((repo) => repo.language)
      .filter((lang): lang is string => Boolean(lang));
    return new Set(languages).size;
  } catch {
    return null;
  }
};

/** Public-only stats via the unauthenticated REST API (no token required). */
const fetchRestStats = async (handle: string): Promise<StatsPayload> => {
  const res = await fetch(`${GITHUB_API}/users/${handle}`, {
    headers: API_HEADERS,
    next: { revalidate: UPSTREAM_CACHE_SECONDS },
  });
  if (!res.ok) throw new Error("Failed to fetch GitHub user");
  const data = (await res.json()) as {
    public_repos?: number;
    created_at?: string;
  };

  // Richer metrics fail soft (rate limits etc.) so partial data still renders.
  const since = toDateStr(Date.now() - ONE_YEAR_MS);
  const [commits, commitsRecent, languages] = await Promise.all([
    fetchCommitCount(`author:${handle}`),
    fetchCommitCount(`author:${handle} committer-date:>${since}`),
    fetchLanguageCount(handle),
  ]);

  const createdAt = data.created_at ? new Date(data.created_at).getTime() : NaN;

  return {
    handle,
    repos: data.public_repos ?? 0,
    languages,
    yearsActive: Number.isNaN(createdAt)
      ? 0
      : Math.max(0, Math.floor((Date.now() - createdAt) / ONE_YEAR_MS)),
    commits,
    commitsRecent,
    totalContributions: null,
    currentStreak: null,
    longestStreak: null,
    source: "rest",
  };
};


const runGraphql = async (
  token: string,
  query: string,
  variables: Record<string, string>
): Promise<unknown> => {
  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL failed (${res.status})`);
  const payload = (await res.json()) as { data?: unknown; errors?: unknown };
  if (!payload.data || payload.errors) {
    throw new Error("GitHub GraphQL returned errors");
  }
  return payload.data;
};

/** Longest and current contribution streaks from day-level calendar data. */
const computeStreaks = (days: ContributionDay[], todayStr: string) => {
  const countsByDate = new Map<string, number>();
  for (const day of days) {
    if (day.date <= todayStr) countsByDate.set(day.date, day.contributionCount);
  }
  const dates = [...countsByDate.keys()].sort();

  let longest = 0;
  let run = 0;
  let previous: string | null = null;
  for (const date of dates) {
    const count = countsByDate.get(date) ?? 0;
    if (count > 0) {
      run = previous !== null && shiftDay(previous, 1) === date ? run + 1 : 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
    previous = date;
  }

  // Current streak counts back from today; if today has no contributions yet,
  // the streak ending yesterday still counts (github-readme-streak-stats rule).
  let current = 0;
  let cursor = todayStr;
  if ((countsByDate.get(cursor) ?? 0) === 0) cursor = shiftDay(cursor, -1);
  while ((countsByDate.get(cursor) ?? 0) > 0) {
    current += 1;
    cursor = shiftDay(cursor, -1);
  }

  return { current, longest };
};


/**
 * Exact profile stats via GraphQL + GITHUB_TOKEN: repo count includes private
 * repos and contribution/streak data matches the profile's contribution graph.
 */
const fetchGraphqlStats = async (
  handle: string,
  token: string
): Promise<StatsPayload> => {
  const identityData = (await runGraphql(
    token,
    `query ($login: String!) {
      user(login: $login) { createdAt }
    }`,
    { login: handle }
  )) as { user: { createdAt?: string } | null };
  if (!identityData.user?.createdAt) throw new Error("GitHub user not found");

  const createdAt = new Date(identityData.user.createdAt).getTime();
  const now = Date.now();
  const startYear = new Date(createdAt).getUTCFullYear();
  const endYear = new Date(now).getUTCFullYear();

  // One aliased query: a contribution calendar per year plus repo/language data.
  const variableDeclarations = ["$login: String!"];
  const variables: Record<string, string> = { login: handle };
  const yearAliases: number[] = [];
  const fragments: string[] = [];

  for (let year = startYear; year <= endYear; year++) {
    yearAliases.push(year);
    variableDeclarations.push(
      `$from${year}: DateTime!`,
      `$to${year}: DateTime!`
    );
    variables[`from${year}`] = new Date(Date.UTC(year, 0, 1)).toISOString();
    variables[`to${year}`] =
      year === endYear
        ? new Date(now).toISOString()
        : new Date(Date.UTC(year, 11, 31, 23, 59, 59)).toISOString();
    fragments.push(`
      y${year}: contributionsCollection(from: $from${year}, to: $to${year}) {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }`);
  }

  const data = (await runGraphql(
    token,
    `query (${variableDeclarations.join(", ")}) {
      user(login: $login) {
        repositories(ownerAffiliations: OWNER, first: 100) {
          totalCount
          nodes { primaryLanguage { name } }
        }
        ${fragments.join("\n")}
      }
    }`,
    variables
  )) as GraphqlUserResponse;

  const user = data.user;
  if (!user) throw new Error("GitHub user not found");

  const allDays: ContributionDay[] = [];
  let totalContributions = 0;
  for (const year of yearAliases) {
    const collection = user[`y${year}`] as
      | { contributionCalendar?: GqlCalendar }
      | undefined;
    const calendar = collection?.contributionCalendar;
    if (!calendar) continue;
    totalContributions += calendar.totalContributions ?? 0;
    for (const week of calendar.weeks ?? []) {
      allDays.push(...(week.contributionDays ?? []));
    }
  }

  const { current, longest } = computeStreaks(allDays, toDateStr(now));

  const languageNames = (user.repositories?.nodes ?? [])
    .map((node) => node?.primaryLanguage?.name)
    .filter((name): name is string => Boolean(name));

  return {
    handle,
    repos: user.repositories?.totalCount ?? 0,
    languages: new Set(languageNames).size,
    yearsActive: Math.max(0, Math.floor((now - createdAt) / ONE_YEAR_MS)),
    commits: null,
    commitsRecent: null,
    totalContributions,
    currentStreak: current,
    longestStreak: longest,
    source: "graphql",
  };
};

export async function GET(req: Request) {
  const handle =
    new URL(req.url).searchParams.get("handle") || "abhijeet8080";
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    try {
      return NextResponse.json(await fetchGraphqlStats(handle, token));
    } catch (error) {
      // Bad token / scope gaps shouldn't break the site — degrade to public data.
      console.error("[api/github-stats] GraphQL failed, using REST:", error);
    }
  }

  try {
    return NextResponse.json(await fetchRestStats(handle));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 502 }
    );
  }
}
