import { create } from "zustand";
import {
  DEFAULT_ACCENT,
  DEFAULT_OS_ACCENT,
  DEFAULT_PALETTE,
} from "@/constant/wallpapers";
import { paletteFromAccent, type AccentPair } from "@/lib/dominantColor";

interface AccentState extends AccentPair {
  /**
   * Wallpaper-matched gradient stops: the wallpaper's own declared colors for
   * gradient wallpapers, or colors sampled from its pixels for image/video
   * ones. Falls back to a palette synthesized from the accent hue.
   */
  palette: string[];
  setAccent: (pair: AccentPair, palette?: string[]) => void;
}

/**
 * Live mirror of the wallpaper-derived accent (see DesktopWallpaper.tsx),
 * for components that need the actual color value in JS — e.g. feeding a
 * shader's `colors` prop — rather than through the `--accent` CSS variable.
 */
export const useAccentStore = create<AccentState>((set) => ({
  accent: DEFAULT_ACCENT,
  osAccent: DEFAULT_OS_ACCENT,
  palette: DEFAULT_PALETTE,
  setAccent: (pair, palette) =>
    set({ ...pair, palette: palette ?? paletteFromAccent(pair.accent) }),
}));
