"use client";

import { motion } from "motion/react";
import { useCodingStats } from "@/hooks/useCodingStats";

export const CodingStatsSlide = () => {
  const { github, loading } = useCodingStats();

  const stats =
    github && github.totalContributions !== null
      ? [
          { label: "Repos", value: github.repos },
          { label: "Contributions", value: github.totalContributions },
          { label: "Current Streak", value: github.currentStreak ?? "—" },
          { label: "Longest Streak", value: github.longestStreak ?? "—" },
        ]
      : [
          { label: "Repos", value: github?.repos ?? 0 },
          { label: "Commits", value: github?.commits ?? "—" },
          { label: "Last 12 Mo", value: github?.commitsRecent ?? "—" },
          { label: "Languages", value: github?.languages ?? "—" },
        ];

  return (
    <motion.div
      key="slide-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
          {"// GitHub Metrics"}
        </span>
        <span className="font-mono text-xs text-neutral-400">
          @{github?.handle || "abhijeet8080"}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={`stat-skeleton-${i}`}
              className="h-16 rounded-xl bg-neutral-900/80 border border-neutral-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col p-3 rounded-xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md"
            >
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-white">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] uppercase text-neutral-400 mt-1 font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
