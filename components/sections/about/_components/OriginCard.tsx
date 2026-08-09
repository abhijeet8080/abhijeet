"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { BentoCard } from "./BentoCard";
import { profile } from "@/constant";
import { cn } from "@/lib/utils";
import { useAccentStore } from "@/store/accentStore";
import { paletteFromAccent } from "@/lib/dominantColor";

interface OriginCardProps {
  imageSrc: string | string[];
  activeIndex?: number;
  onSelectIndex?: (index: number) => void;
  index?: number;
}

export const OriginCard = ({
  imageSrc,
  activeIndex = 0,
  onSelectIndex,
  index = 0,
}: OriginCardProps) => {
  const images = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
  const currentImgIndex = Math.min(activeIndex, images.length - 1);
  const currentImage = images[currentImgIndex] || images[0];

  const accent = useAccentStore((s) => s.accent);
  const osAccent = useAccentStore((s) => s.osAccent);
  const wallpaperPalette = useAccentStore((s) => s.palette);
  // Prefer the wallpaper's own colors (exact match with the desktop
  // background); fall back to a palette synthesized from the accent hue.
  const gradientColors = useMemo(
    () => (wallpaperPalette.length ? wallpaperPalette : paletteFromAccent(accent)),
    [wallpaperPalette, accent]
  );
  const [c0, c1, c2] = [
    gradientColors[0] ?? accent,
    gradientColors[1] ?? gradientColors[0] ?? accent,
    gradientColors[2] ?? gradientColors[0] ?? accent,
  ];

  return (
    <BentoCard
      gradientColors={gradientColors}
      className="flex flex-col p-0 overflow-hidden relative min-h-72 sm:min-h-80 justify-between"
      index={index}
    >
      {/* Photo Container */}
      <div
        className="group relative flex-1 aspect-square w-full overflow-hidden"
        style={{
          background: `linear-gradient(160deg, color-mix(in srgb, ${c1} 22%, #050506) 0%, color-mix(in srgb, ${c0} 15%, #050506) 55%, color-mix(in srgb, ${c2} 20%, #050506) 100%)`,
        }}
      >
        {/* Wallpaper-matched glow — visible through the transparent PNG and
            intensifies on hover so the cutout blends with the desktop bg.
            Pure CSS (no extra WebGL context), colors come from the wallpaper
            itself via the accent store. */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: [
              `radial-gradient(ellipse 90% 65% at 50% -10%, color-mix(in srgb, ${c1} 45%, transparent), transparent 65%)`,
              `radial-gradient(ellipse 75% 60% at 100% 100%, color-mix(in srgb, ${c0} 40%, transparent), transparent 70%)`,
              `radial-gradient(ellipse 70% 55% at 0% 95%, color-mix(in srgb, ${c2} 32%, transparent), transparent 65%)`,
            ].join(", "),
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImgIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={currentImage}
              alt={profile.name.full}
              fill
              className="object-cover object-top grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Wallpaper color-grade — repaints the photo's hue/saturation from
            the active wallpaper palette + OS accent while keeping its natural
            luminance (`color` blend). Kept light at rest so the photo still
            reads as a photo, not a flat duotone; on hover it eases back
            further so the real colors take over, with the warm cast still
            pulled toward the wallpaper instead of clashing with it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] opacity-40 transition-opacity duration-700 group-hover:opacity-20"
          style={{
            background: `linear-gradient(155deg, ${c1} 0%, ${c0} 48%, ${osAccent} 115%)`,
            mixBlendMode: "color",
          }}
        />
        {/* Depth pass — restores the contrast/richness the color blend
            flattens, like light spilling up from the wallpaper below. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] opacity-40 mix-blend-soft-light"
          style={{
            background: `linear-gradient(180deg, transparent 45%, color-mix(in srgb, ${c0} 70%, transparent) 130%)`,
          }}
        />
        {/* Natural vignette — fades the photo's own edges toward the
            wallpaper-tinted container background (not flat black) so the
            cutout feels grounded in the surface rather than sitting on top
            of it like a sticker. Darkens corners subtly and melts the
            bottom edge into the pagination bar. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6] transition-opacity duration-700 group-hover:opacity-70"
          style={{
            background: [
              `radial-gradient(ellipse 120% 90% at 50% 40%, transparent 55%, color-mix(in srgb, ${c0} 15%, #050506) 115%)`,
              `linear-gradient(180deg, color-mix(in srgb, ${c1} 12%, #050506) 0%, transparent 20%, transparent 72%, color-mix(in srgb, ${c2} 18%, #050506) 100%)`,
            ].join(", "),
          }}
        />

        {/* Subtle Scanline Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
          }}
        />

        {/* Monospace Tech Corner Brackets */}
        <span className="pointer-events-none absolute top-3 left-3 z-10 font-mono text-[10px] text-accent/70">
          ┌
        </span>
        <span className="pointer-events-none absolute top-3 right-3 z-10 font-mono text-[10px] text-accent/70">
          ┐
        </span>
        <span className="pointer-events-none absolute bottom-3 left-3 z-10 font-mono text-[10px] text-accent/70">
          └
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 z-10 font-mono text-[10px] text-accent/70">
          ┘
        </span>

        {/* Image Pagination Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-800">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => onSelectIndex?.(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300 focus:outline-none",
                  i === currentImgIndex
                    ? "bg-accent scale-125 shadow-sm"
                    : "bg-neutral-600 hover:bg-neutral-400 cursor-pointer",
                )}
                title={`Image ${i + 1} of ${images.length}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </BentoCard>
  );
};
