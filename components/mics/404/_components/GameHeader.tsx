"use client";

import React from "react";
import { motion } from "motion/react";

export const GameHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-3 mb-8 text-center"
    >
      <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {"// 404"}
      </div>
      <h1 className="font-heading text-3xl font-bold text-primary drop-shadow-md sm:text-4xl md:text-5xl">
        Page not found, let&apos;s play
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
        Flip matching icons in the 404 grid to clear the game and unlock your custom winner trophy!
      </p>
    </motion.div>
  );
};
