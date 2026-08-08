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
}

/**
 * Renders a faithful preview of any wallpaper type —
 * used by the desktop background and the System Settings thumbnails.
 */
export const WallpaperPreview = ({
  wallpaper,
  mediaRef,
  onMediaReady,
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