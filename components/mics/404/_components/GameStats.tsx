"use client";

import React from "react";
import { FaGamepad, FaClock, FaCheck } from "react-icons/fa6";
import { formatTime } from "../utils";

interface GameStatsProps {
  moves: number;
  timeSeconds: number;
  matchedPairsCount: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  moves,
  timeSeconds,
  matchedPairsCount,
}) => {
  return (
    <div className="inline-flex items-center gap-4 rounded-lg border border-border bg-background/60 px-4 py-2 font-mono text-xs sm:text-sm">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <FaGamepad className="size-3.5 text-accent" />
        <span>Moves:</span>
        <span className="font-bold text-primary">{moves}</span>
      </div>
      <div className="h-3.5 w-px bg-border" />
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <FaClock className="size-3.5 text-accent" />
        <span>Time:</span>
        <span className="font-bold text-primary">{formatTime(timeSeconds)}</span>
      </div>
      <div className="h-3.5 w-px bg-border" />
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <FaCheck className="size-3.5 text-accent" />
        <span>Pairs:</span>
        <span className="font-bold text-primary">{matchedPairsCount} / 10</span>
      </div>
    </div>
  );
};
