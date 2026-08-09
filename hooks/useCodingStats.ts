"use client";

import { useState, useEffect } from "react";
import { socials } from "@/constant";

export interface GithubStats {
  repos: number;
  commits: number | null;
  commitsRecent: number | null;
  languages: number | null;
  yearsActive: number;
  handle: string;
}

export interface CodingStats {
  github: GithubStats | null;
  loading: boolean;
}

interface CachedStats {
  data: GithubStats;
  timestamp: number;
}

const STORAGE_KEY = "abhi-os:github-stats-v2";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

const API_BASE = "https://api.github.com";
const API_HEADERS = { Accept: "application/vnd.github+json" };

/** Total count from the commit search API (fail-soft: null on rate limit / error). */
const fetchCommitCount = async (query: string): Promise<number | null> => {
  try {
    const res = await fetch(
      `${API_BASE}/search/commits?q=${encodeURIComponent(query)}&per_page=1`,
      { headers: API_HEADERS }
    );
    if (!res.ok) return null;
    const data: { total_count?: number } = await res.json();
    return typeof data.total_count === "number" ? data.total_count : null;
  } catch {
    return null;
  }
};

/** Count of distinct primary languages across public repos (fail-soft). */
const fetchLanguageCount = async (handle: string): Promise<number | null> => {
  try {
    const res = await fetch(`${API_BASE}/users/${handle}/repos?per_page=100`, {
      headers: API_HEADERS,
    });
    if (!res.ok) return null;
    const repos: Array<{ language?: string | null }> = await res.json();
    if (!Array.isArray(repos)) return null;
    const languages = repos
      .map((repo) => repo.language)
      .filter((lang): lang is string => Boolean(lang));
    return new Set(languages).size;
  } catch {
    return null;
  }
};

export const useCodingStats = (): CodingStats => {
  const [stats, setStats] = useState<CodingStats>({
    github: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const githubHandle =
      socials.find((s) => s.name.toLowerCase() === "github")?.handle ||
      "abhijeet8080";

    const loadStats = async () => {
      let cached: CachedStats | null = null;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          cached = JSON.parse(stored);
        }
      } catch {}

      const now = Date.now();
      const isCacheValid =
        cached &&
        cached.timestamp &&
        cached.data &&
        now - cached.timestamp < ONE_WEEK_MS;

      if (isCacheValid && cached) {
        if (isMounted) {
          setStats({
            github: cached.data,
            loading: false,
          });
        }
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/users/${githubHandle}`, {
          headers: API_HEADERS,
        });
        if (!res.ok) throw new Error("Failed to fetch GitHub stats");
        const data: { public_repos?: number; created_at?: string } =
          await res.json();

        // Richer metrics fail soft (rate limits etc.) so partial data still renders.
        const since = new Date(now - ONE_YEAR_MS).toISOString().slice(0, 10);
        const [commits, commitsRecent, languages] = await Promise.all([
          fetchCommitCount(`author:${githubHandle}`),
          fetchCommitCount(`author:${githubHandle} committer-date:>${since}`),
          fetchLanguageCount(githubHandle),
        ]);

        const createdAt = data.created_at
          ? new Date(data.created_at).getTime()
          : NaN;
        const yearsActive = Number.isNaN(createdAt)
          ? 0
          : Math.max(0, Math.floor((now - createdAt) / ONE_YEAR_MS));

        const githubData: GithubStats = {
          repos: data.public_repos ?? 0,
          commits,
          commitsRecent,
          languages,
          yearsActive,
          handle: githubHandle,
        };

        // Cache only complete results so a transient rate limit doesn't stick for a week.
        if (commits !== null && commitsRecent !== null && languages !== null) {
          try {
            const cachePayload: CachedStats = {
              data: githubData,
              timestamp: now,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cachePayload));
          } catch {}
        }

        if (isMounted) {
          setStats({
            github: githubData,
            loading: false,
          });
        }
      } catch {
        if (isMounted) {
          setStats({
            github: cached?.data || null,
            loading: false,
          });
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return stats;
};
