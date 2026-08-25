"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useWallpaperStore } from "@/store/wallpaperStore";
import { WallpaperPreview } from "./WallpaperPreview";
import { useAccentStore } from "@/store/accentStore";
import {
  DEFAULT_ACCENT,
  DEFAULT_OS_ACCENT,
  DEFAULT_WALLPAPER_ID,
  WALLPAPERS,
} from "@/constant/wallpapers";
import {
  accentFromGradientColors,
  extractDominantAccent,
  extractDominantPalette,
  type AccentPair,
} from "@/lib/dominantColor";

interface CachedAccent {
  pair: AccentPair;
  /** Wallpaper's own gradient stops (declared or pixel-sampled). */
  palette: string[];
}

// Per-wallpaper-id memo so re-selecting a wallpaper doesn't re-sample pixels.
const accentCache = new Map<string, CachedAccent>();

const applyAccent = (pair: AccentPair, palette?: string[]) => {
  const root = document.documentElement;
  root.style.setProperty("--accent", pair.accent);
  root.style.setProperty("--ring", pair.accent);
  root.style.setProperty("--os-accent", pair.osAccent);
  // Mirror into JS-reachable state for components that need the raw value
  // (e.g. feeding a shader's `colors` prop) rather than the CSS variable.
  useAccentStore.getState().setAccent(pair, palette?.length ? palette : undefined);
};

/** Accent + wallpaper-matched palette sampled from a decoded image/video. */
const sampleMedia = (el: HTMLImageElement | HTMLVideoElement): CachedAccent | null => {
  const pair = extractDominantAccent(el);
  if (!pair) return null;
  return { pair, palette: extractDominantPalette(el) ?? [] };
};

/**
 * The desktop background of abhi os.
 * Supports three wallpaper types (macOS-style):
 *  - gradient: animated grain shader (default)
 *  - image:    cover-fit static image from /public/wallpapers
 *  - video:    muted looping video from /public/wallpapers
 */
export const DesktopWallpaper = () => {
  const currentId = useWallpaperStore((s) => s.currentId);
  const wallpaper =
    WALLPAPERS.find((w) => w.id === currentId && w.available) ??
    WALLPAPERS.find((w) => w.id === DEFAULT_WALLPAPER_ID) ??
    WALLPAPERS[0];

  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);

  // Sync the site + OS accent colors with the active wallpaper. Gradients are
  // derived instantly from their declared color stops; images/videos are
  // sampled on canvas once their pixels are actually available (below).
  useEffect(() => {
    const cached = accentCache.get(wallpaper.id);
    if (cached) {
      applyAccent(cached.pair, cached.palette);
      return;
    }

    if (wallpaper.type === "gradient") {
      const pair = accentFromGradientColors(wallpaper.colors ?? []) ?? {
        accent: wallpaper.accent ?? DEFAULT_ACCENT,
        osAccent: wallpaper.osAccent ?? DEFAULT_OS_ACCENT,
      };
      // Gradient wallpapers declare their exact stops — the card gradients
      // then match the desktop shader color-for-color.
      const palette = wallpaper.colors?.length ? wallpaper.colors : undefined;
      accentCache.set(wallpaper.id, { pair, palette: palette ?? [] });
      applyAccent(pair, palette);
      return;
    }

    // Image/video: apply a placeholder immediately to avoid a flash, real
    // extraction runs once the media is decoded (see onLoad/onLoadedData).
    applyAccent({
      accent: wallpaper.accent ?? DEFAULT_ACCENT,
      osAccent: wallpaper.osAccent ?? DEFAULT_OS_ACCENT,
    });

    // If the element is already decoded (e.g. cached by the browser), the
    // load event won't fire again — sample it directly.
    const el = mediaRef.current;
    if (el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0) {
      const sampled = sampleMedia(el);
      if (sampled) {
        accentCache.set(wallpaper.id, sampled);
        applyAccent(sampled.pair, sampled.palette);
      }
    } else if (el instanceof HTMLVideoElement && el.readyState >= 2) {
      const sampled = sampleMedia(el);
      if (sampled) {
        accentCache.set(wallpaper.id, sampled);
        applyAccent(sampled.pair, sampled.palette);
      }
    }
  }, [wallpaper]);

  const handleMediaReady = () => {
    const el = mediaRef.current;
    if (!el) return;
    const sampled = sampleMedia(el);
    if (sampled) {
      accentCache.set(wallpaper.id, sampled);
      applyAccent(sampled.pair, sampled.palette);
    }
  };

  // Gradient wallpapers render through a WebGL shader, which can't paint until
  // its bundle has downloaded, parsed, and compiled. Until then the canvas is
  // transparent — so without this, the desktop is pure black for however long
  // that takes (seconds on a slow device). A plain CSS gradient built from the
  // wallpaper's own stops paints on the very first frame with zero JS, and the
  // shader then fades in over it. The PreLoader only covers the first visit in
  // a session, so this is what keeps repeat visits from flashing black.
  const staticBase =
    wallpaper.type === "gradient" && wallpaper.colors?.length
      ? `linear-gradient(135deg, ${wallpaper.colors.join(", ")})`
      : undefined;

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 h-full w-full overflow-hidden bg-black">
      {staticBase && (
        <div
          className="absolute inset-0"
          style={{ background: staticBase }}
          aria-hidden
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={wallpaper.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <WallpaperPreview
            wallpaper={wallpaper}
            mediaRef={mediaRef}
            onMediaReady={handleMediaReady}
          />
        </motion.div>
      </AnimatePresence>

      {/* Readability scrim */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
};

export default DesktopWallpaper;