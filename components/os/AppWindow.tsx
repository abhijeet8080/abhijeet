"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationControls,
  useDragControls,
} from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { useWindowStore, type AppWindowData } from "@/store/windowStore";
import { playPop } from "@/lib/sounds";
import { OS_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AppWindowProps {
  win: AppWindowData;
  width?: number;
  height?: number;
  children: React.ReactNode;
}

const MENU_BAR_HEIGHT = 28; // h-7

export const AppWindow = ({
  win,
  width = 660,
  height = 420,
  children,
}: AppWindowProps) => {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    destroyWindow,
  } = useWindowStore();

  const controls = useAnimationControls();
  const dragControls = useDragControls();
  const isActive = useWindowStore((s) => s.activeWindowId === win.id);
  const mounted = useRef(false);

  // Mount animation
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      controls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.28, ease: OS_EASE },
      });
    }
  }, [controls]);

  // Close animation → destroy
  useEffect(() => {
    if (win.isClosing) {
      playPop();
      controls
        .start({
          opacity: 0,
          scale: 0.92,
          y: 12,
          transition: { duration: 0.2, ease: OS_EASE },
        })
        .then(() => destroyWindow(win.id));
    }
  }, [win.isClosing, controls, destroyWindow, win.id]);

  // Minimize / restore animation
  useEffect(() => {
    if (!mounted.current) return;
    if (win.isMinimized) {
      playPop();
      controls.start({
        opacity: 0,
        scale: 0.4,
        y: 320,
        transition: { duration: 0.25, ease: OS_EASE },
      });
    } else {
      controls.start({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.25, ease: OS_EASE },
      });
    }
  }, [win.isMinimized, controls]);

  const cascade = win.spawnIndex * 28;

  const isDismissed = win.isMinimized || win.isClosing;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 24 }}
      animate={controls}
      drag={!win.isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onPointerDown={() => focusWindow(win.id)}
      data-app-window
      inert={isDismissed}
      aria-hidden={isDismissed}
      style={{
        zIndex: win.zIndex,
        left: win.isMaximized
          ? 0
          : `max(8px, calc(50% - ${width / 2}px + ${cascade - 56}px))`,
        top: win.isMaximized
          ? MENU_BAR_HEIGHT
          : `max(${MENU_BAR_HEIGHT + 8}px, calc(50% - ${height / 2}px + ${cascade - 70}px))`,
        width: win.isMaximized ? "100%" : `min(${width}px, calc(100vw - 16px))`,
        height: win.isMaximized
          ? `calc(100dvh - ${MENU_BAR_HEIGHT}px)`
          : `min(${height}px, calc(100dvh - 100px))`,
        maxWidth: "100vw",
      }}
      className={cn(
        "fixed flex flex-col overflow-hidden border bg-[#161617]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl",
        win.isMaximized
          ? "rounded-none border-white/5"
          : "rounded-xl border-white/10",
        isActive ? "border-white/20" : "border-white/10",
        isDismissed && "pointer-events-none"
      )}
    >
      {/* Title bar / drag handle */}
      <div
        onPointerDown={(e) => {
          focusWindow(win.id);
          if (!win.isMaximized) dragControls.start(e);
        }}
        className="relative flex h-9 shrink-0 cursor-default items-center border-b border-white/5 px-3 select-none"
      >
        {/* Traffic lights */}
        <div className="group flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#FF5F57] transition-colors"
            aria-label="Close"
          >
            <span className="absolute -inset-2 rounded-full" aria-hidden />
            <X className="h-2 w-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#FEBC2E] transition-colors"
            aria-label="Minimize"
          >
            <span className="absolute -inset-2 rounded-full" aria-hidden />
            <Minus className="h-2 w-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#28C840] transition-colors"
            aria-label="Zoom"
          >
            <span className="absolute -inset-2 rounded-full" aria-hidden />
            <Plus className="h-2 w-2 text-black/60 opacity-0 group-hover:opacity-100" />
          </button>
        </div>

        {/* Title */}
        <span
          className={cn(
            "pointer-events-none absolute left-1/2 -translate-x-1/2 text-[13px] font-medium",
            isActive ? "text-white/80" : "text-white/40"
          )}
        >
          {win.title}
        </span>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-hidden" data-lenis-prevent>
        {children}
      </div>
    </motion.div>
  );
};

export default AppWindow;
