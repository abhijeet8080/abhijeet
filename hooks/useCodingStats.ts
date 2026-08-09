"use client";

import { useState, useEffect } from "react";
import { socials } from "@/constant";

export interface GithubStats {
  repos: number;
  commits: number | null;
  commitsRecent: number | null;
  languages: number | null;
  yearsActive: number;
  totalContributions: number | null;
  currentStreak: number | null;
  longestStreak: number | null;
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

const STORAGE_KEY = "abhi-os:github-stats-v3";
// Streaks move daily, so cache for hours rather than a week.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

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
        now - cached.timestamp < CACHE_TTL_MS;

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
        // Single call to our API route — it uses GraphQL + GITHUB_TOKEN when
        // configured (private repos, contributions, streaks) and otherwise
        // falls back to the public REST API.
        const res = await fetch(
          `/api/github-stats?handle=${encodeURIComponent(githubHandle)}`
        );
        if (!res.ok) throw new Error("Failed to fetch GitHub stats");
        const githubData: GithubStats = await res.json();

        try {
          const cachePayload: CachedStats = {
            data: githubData,
            timestamp: now,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cachePayload));
        } catch {}

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
