import { create } from "zustand";
import { DEFAULT_ACCENT, DEFAULT_OS_ACCENT } from "@/constant/wallpapers";
import type { AccentPair } from "@/lib/dominantColor";

interface AccentState extends AccentPair {
  setAccent: (pair: AccentPair) => void;
}

/**
 * Live mirror of the wallpaper-derived accent (see DesktopWallpaper.tsx),
 * for components that need the actual color value in JS — e.g. feeding a
 * shader's `colors` prop — rather than through the `--accent` CSS variable.
 */
export const useAccentStore = create<AccentState>((set) => ({
  accent: DEFAULT_ACCENT,
  osAccent: DEFAULT_OS_ACCENT,
  setAccent: (pair) => set(pair),
}));
