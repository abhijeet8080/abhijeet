"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  FaTrophy,
  FaStar,
  FaDownload,
  FaAward,
  FaRotateRight,
  FaHouse,
  FaUser,
} from "react-icons/fa6";
import { formatTime, downloadSVGTrophy, downloadPNGFromSVG } from "../utils";

interface VictoryModalProps {
  isOpen: boolean;
  moves: number;
  timeSeconds: number;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  moves,
  timeSeconds,
  onPlayAgain,
}) => {
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState<"svg" | "png" | null>(null);

  if (!isOpen) return null;

  const handleDownloadSVG = () => {
    setIsDownloading("svg");
    downloadSVGTrophy(moves, timeSeconds, playerName);
    setTimeout(() => setIsDownloading(null), 500);
  };

  const handleDownloadPNG = () => {
    setIsDownloading("png");
    downloadPNGFromSVG(moves, timeSeconds, playerName, () => {
      setIsDownloading(null);
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-card border border-border rounded-3xl max-w-md w-full p-6 sm:p-8 text-center overflow-hidden"
        >
          {/* Victory Trophy Icon Art */}
          <div className="relative mx-auto size-24 sm:size-28 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center mb-4">
            <FaTrophy className="size-12 sm:size-14 text-accent animate-bounce" />
            <FaStar className="absolute top-2 right-2 size-5 text-accent/80 animate-pulse" />
          </div>

          {/* Title & Description */}
          <h2 className="font-heading text-2xl font-bold text-primary tracking-tight sm:text-3xl">
            Victory unlocked
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 mb-5">
            You matched all 20 tiles in the 404 grid. Customize and download your trophy below.
          </p>

          {/* Stats Summary Box */}
          <div className="grid grid-cols-2 gap-3 bg-background/70 border border-border rounded-2xl p-3.5 mb-5">
            <div className="text-center border-r border-border pr-2">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Total moves</div>
              <div className="text-2xl font-extrabold text-accent mt-0.5">{moves}</div>
            </div>
            <div className="text-center pl-2">
              <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Time taken</div>
              <div className="text-2xl font-extrabold text-accent mt-0.5">{formatTime(timeSeconds)}</div>
            </div>
          </div>

          {/* Player Name Input Field */}
          <div className="mb-5 text-left">
            <label className="block font-mono text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">
              Player name (optional)
            </label>
            <div className="relative flex items-center">
              <FaUser className="absolute left-3.5 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter name (optional)"
                maxLength={30}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background/70 border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Trophy & Card Download Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleDownloadSVG}
              disabled={isDownloading !== null}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-accent/40 bg-accent/15 px-5 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent/25 cursor-pointer disabled:opacity-50"
            >
              <FaDownload className="size-4" />
              <span>{isDownloading === "svg" ? "Generating SVG..." : "Download SVG trophy"}</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              disabled={isDownloading !== null}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background/60 px-5 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:border-card-border-hover hover:bg-card-hover cursor-pointer disabled:opacity-50"
            >
              <FaAward className="size-4 text-accent" />
              <span>{isDownloading === "png" ? "Converting to PNG..." : "Download PNG trophy"}</span>
            </button>
          </div>

          {/* Action Buttons: Play Again & Go Home */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:border-card-border-hover hover:bg-card-hover cursor-pointer"
            >
              <FaRotateRight className="size-3.5 text-accent" />
              <span>Play again</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/15 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent/25 cursor-pointer"
            >
              <FaHouse className="size-3.5" />
              <span>Go home</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
