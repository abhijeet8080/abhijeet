"use client";

import React from "react";
import { motion } from "motion/react";
import { CardTile } from "../types";
import { cn } from "@/lib/utils";

interface TileCardProps {
  tile: CardTile;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export const TileCard: React.FC<TileCardProps> = ({
  tile,
  isFlipped,
  isMatched,
  onClick,
}) => {
  const Icon = tile.iconData.icon;

  return (
    <motion.div
      onClick={onClick}
      className="group size-8 xs:size-10 sm:size-14 md:size-16 lg:size-20 cursor-pointer select-none"
      style={{ perspective: 1200 }}
      whileHover={
        !isFlipped && !isMatched
          ? {
              rotateX: -6,
              rotateY: 6,
              scale: 1.05,
            }
          : {}
      }
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 24,
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{
          rotateY: isFlipped || isMatched ? 180 : 0,
          scale: isMatched ? [1, 1.08, 1] : 1,
        }}
        transition={{
          rotateY: {
            type: "spring",
            stiffness: 220,
            damping: 20,
          },
          scale: {
            duration: 0.35,
          },
        }}
      >
        {/* FRONT */}
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl",
            "border border-border",
            "bg-linear-to-br from-card via-card/80 to-background",
            "transition-all duration-300",
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Glass highlight */}
          <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,.12),transparent_35%)]" />

          {/* Shimmer */}
          <motion.div
            className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ["-120%", "250%"],
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 2,
              duration: 1.6,
              ease: "easeInOut",
            }}
          />

          {/* <div className="relative flex h-full items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="size-2.5 rounded-full bg-white/20 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
            />
          </div> */}
        </div>

        {/* BACK */}
        <div
          className={cn(
            "absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl",
            "flex items-center justify-center",
            "border",
            tile.iconData.bg,
            isMatched
              ? "border-accent ring-1 ring-accent/40"
              : "border-border bg-card",
          )}
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* soft glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.06),transparent_70%)]" />

          <motion.div
            initial={false}
            animate={{
              scale: isFlipped || isMatched ? 1 : 0.6,
              rotate: isMatched ? 8 : 0,
            }}
            transition={{
              rotate: {
                type: "spring",
                stiffness: 500,
                damping: 10,
              },
            }}
          >
            <Icon
              className={cn(
                "size-4 xs:size-5 sm:size-7 md:size-8",
                tile.iconData.color,
              )}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
