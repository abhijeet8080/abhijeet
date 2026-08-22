"use client";

import {
  Check,
  FilePlus2,
  Monitor,
  Moon,
  Volume2,
  Wallpaper as WallpaperIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useWallpaperStore } from "@/store/wallpaperStore";
import {
  DEFAULT_WALLPAPER_ID,
  WALLPAPERS,
  type Wallpaper,
} from "@/constant/wallpapers";
import { WallpaperPreview } from "@/components/os/WallpaperPreview";
import { playPop } from "@/lib/sounds";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { name: "Wallpaper", icon: WallpaperIcon, active: true },
  { name: "Displays", icon: Monitor, active: false },
  { name: "Sound", icon: Volume2, active: false },
  { name: "Focus", icon: Moon, active: false },
];

const WallpaperCard = ({ wallpaper }: { wallpaper: Wallpaper }) => {
  const currentId = useWallpaperStore((s) => s.currentId);
  const setWallpaper = useWallpaperStore((s) => s.setWallpaper);
  const isActive = currentId === wallpaper.id;

  const handleSelect = () => {
    if (!wallpaper.available) {
      toast.info(
        `Drop a file at public${wallpaper.src} and enable it in constant/wallpapers.ts`
      );
      return;
    }
    playPop();
    setWallpaper(wallpaper.id);
    toast.success(`Wallpaper set to “${wallpaper.name}”`);
  };

  return (
    <button
      onClick={handleSelect}
      className={cn(
        "group relative flex cursor-default flex-col items-center gap-1.5 rounded-xl p-1.5 transition-colors",
        isActive ? "bg-white/10" : "hover:bg-white/5",
        !wallpaper.available && "opacity-50"
      )}
    >
      <div
        className={cn(
          "relative h-20 w-full overflow-hidden rounded-lg border-2 transition-colors sm:h-24",
          isActive
            ? "border-os-accent"
            : "border-transparent group-hover:border-white/20"
        )}
      >
        {/* Live preview of the actual wallpaper */}
        {wallpaper.available ? (
          <WallpaperPreview wallpaper={wallpaper} mode="static" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-white/5">
            <FilePlus2 className="h-4 w-4 text-white/35" />
            <span className="text-[9px] font-medium uppercase tracking-wide text-white/35">
              add file
            </span>
          </div>
        )}

        {isActive && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-os-accent">
            <Check className="h-2.5 w-2.5 text-white" />
          </span>
        )}
        <span className="absolute bottom-1 left-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white/70">
          {wallpaper.type}
        </span>
      </div>
      <span className="text-[11px] font-medium text-white/75">
        {wallpaper.name}
      </span>
    </button>
  );
};

export const SettingsWindow = () => {
  const currentId = useWallpaperStore((s) => s.currentId);
  const current =
    WALLPAPERS.find((w) => w.id === currentId && w.available) ??
    WALLPAPERS.find((w) => w.id === DEFAULT_WALLPAPER_ID) ??
    WALLPAPERS[0];

  return (
    <div className="flex h-full bg-[#1C1C1E]/95">
      {/* Sidebar */}
      <aside className="hidden w-44 shrink-0 flex-col gap-0.5 border-r border-white/5 bg-white/[0.03] p-2 sm:flex">
        {SIDEBAR_ITEMS.map((item) => (
          <div
            key={item.name}
            className={cn(
              "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[12px]",
              item.active ? "bg-os-accent/80 text-white" : "text-white/40"
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.name}
          </div>
        ))}
      </aside>

      {/* Main panel */}
      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="text-lg font-semibold text-white/90">Wallpaper</h2>
        <p className="mt-0.5 text-[12px] text-white/45">
          Choose your desktop wallpaper — every thumbnail is a live preview.
        </p>

        {/* Current wallpaper hero preview */}
        <div className="relative mt-4 h-40 w-full overflow-hidden rounded-xl border border-white/10 sm:h-48">
          <WallpaperPreview wallpaper={current} />
          <div className="absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-1 text-[11px] font-medium text-white/85 backdrop-blur">
            {current.name} — current
          </div>
        </div>

        {/* All wallpapers */}
        <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">
          All Wallpapers
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {WALLPAPERS.map((w) => (
            <WallpaperCard key={w.id} wallpaper={w} />
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-3 text-[11px] leading-relaxed text-white/45">
          <span className="font-semibold text-white/60">Pro tip:</span> add your
          own <span className="font-mono">.jpg</span> /{" "}
          <span className="font-mono">.mp4</span> files to{" "}
          <span className="font-mono">public/wallpapers/</span> and set{" "}
          <span className="font-mono">available: true</span> in{" "}
          <span className="font-mono">constant/wallpapers.ts</span> — the
          preview appears here automatically.
        </div>
      </div>
    </div>
  );
};

export default SettingsWindow;

