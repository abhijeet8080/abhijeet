"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSystemStore } from "@/store/systemStore";
import { profile } from "@/constant";
import { serif } from "@/app/fonts";
import { cn } from "@/lib/utils";

/** Dims the whole screen based on the Control Center brightness slider */
export const BrightnessOverlay = () => {
  const brightness = useSystemStore((s) => s.brightness);
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9000] bg-black transition-opacity duration-200"
      style={{ opacity: (1 - brightness) * 0.65 }}
      aria-hidden
    />
  );
};

/** Black screen — click anywhere to wake */
export const SleepOverlay = () => {
  const { isSleeping, wake } = useSystemStore();

  return (
    <AnimatePresence>
      {isSleeping && (
        <motion.div
          data-os-chrome
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={wake}
          className="fixed inset-0 z-[21000] cursor-pointer bg-black"
        />
      )}
    </AnimatePresence>
  );
};

/** macOS-style lock screen with big clock — click anywhere to log in */
export const LockScreen = () => {
  const { isLocked, unlock } = useSystemStore();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isLocked) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isLocked]);

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          data-os-chrome
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={unlock}
          className="fixed inset-0 z-[20000] flex cursor-pointer flex-col items-center bg-black/40 backdrop-blur-3xl select-none"
        >
          <div className="mt-[16vh] flex flex-col items-center">
            <div className="text-[17px] font-medium text-white/80">
              {now.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="mt-1 text-[92px] leading-none font-bold tracking-tight text-white tabular-nums">
              {now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
          </div>

          <div className="mt-auto mb-[10vh] flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <span className={cn(serif.className, "text-2xl text-white")}>
                {profile.name.first[0]}
                {profile.name.last[0]}
              </span>
            </div>
            <div className="text-sm font-medium text-white/80">
              {profile.name.full}
            </div>
            <div className="mt-1 text-[12px] text-white/45">
              Click anywhere to log in
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
