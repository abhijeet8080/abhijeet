"use client";

import type { RefObject } from "react";
import { GrainGradient } from "@paper-design/shaders-react";
import type { Wallpaper } from "@/constant/wallpapers";

interface WallpaperPreviewProps {
  wallpaper: Wallpaper;
  /** Optional hook into the rendered media element (used for accent extraction) */
  mediaRef?: RefObject<HTMLImageElement | HTMLVideoElement | null>;
  /** Called when image pixels are loaded / video data is ready */
  onMediaReady?: () => void;
  /**
   * "static" renders gradients as a plain CSS gradient instead of the
   * animated WebGL shader. Browsers cap simultaneous WebGL contexts, and
   * every GrainGradient instance opens one — with a dozen-plus gradient
   * thumbnails on screen at once (e.g. the System Settings grid), the
   * oldest contexts get silently evicted and render blank. Use "static"
   * for small/list thumbnails; reserve "full" for the one active preview.
   */
  mode?: "full" | "static";
}

/**
 * Renders a faithful preview of any wallpaper type —
 * used by the desktop background and the System Settings thumbnails.
 */
export const WallpaperPreview = ({
  wallpaper,
  mediaRef,
  onMediaReady,
  mode = "full",
}: WallpaperPreviewProps) => {
  if (wallpaper.type === "image" && wallpaper.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={(el) => {
          if (mediaRef) mediaRef.current = el;
        }}
        src={wallpaper.src}
        alt={wallpaper.name}
        className="h-full w-full object-cover"
        onLoad={onMediaReady}
      />
    );
  }

  if (wallpaper.type === "video" && wallpaper.src) {
    return (
      <video
        ref={(el) => {
          if (mediaRef) mediaRef.current = el;
        }}
        src={wallpaper.src}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        onLoadedData={onMediaReady}
      />
    );
  }

  if (mode === "static") {
    const colors = wallpaper.colors ?? [];
    return (
      <div
        className="h-full w-full"
        style={{
          background: colors.length
            ? `linear-gradient(135deg, ${colors.join(", ")})`
            : "#000",
        }}
      />
    );
  }

  return (
    <GrainGradient
      style={{ height: "100%", width: "100%" }}
      colorBack="hsl(0, 0%, 0%)"
      softness={0.5}
      intensity={0.3}
      noise={0}
      shape={wallpaper.shape ?? "corners"}
      offsetX={0}
      offsetY={0}
      scale={1}
      rotation={0}
      speed={1}
      colors={wallpaper.colors ?? []}
    />
  );
};

export default WallpaperPreview;