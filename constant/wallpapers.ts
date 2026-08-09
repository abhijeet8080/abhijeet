export type WallpaperType = "gradient" | "image" | "video";

export interface Wallpaper {
  id: string;
  name: string;
  type: WallpaperType;
  /** Gradient wallpapers: colors fed to the GrainGradient shader */
  colors?: string[];
  shape?: "corners" | "wave" | "dots" | "truchet" | "ripple" | "blob" | "sphere";
  /** Image/video wallpapers: path under /public (e.g. /wallpapers/seqouia.jpg) */
  src?: string;
  /**
   * Design accent applied to the whole site (--accent / --ring) when this
   * wallpaper is active — section highlights, badges, links, toasts…
   */
  accent?: string;
  /**
   * macOS-style accent applied to the OS chrome (--os-accent) — menu
   * highlights, toggles, Spotlight selection, terminal prompt…
   */
  osAccent?: string;
  /**
   * Set false for entries whose asset file does not exist yet —
   * they show up disabled in System Settings until you drop the
   * file into /public/wallpapers and flip this flag.
   */
  available: boolean;
}

export const DEFAULT_WALLPAPER_ID = "abhi-dark";

export const DEFAULT_ACCENT = "hsl(193 85% 66%)";
export const DEFAULT_OS_ACCENT = "#0A84FF";

/**
 * Gradient stops of the default wallpaper — used as the initial accent palette
 * (bento card washes, photo backdrop) before/while the live one is derived.
 * Kept in sync with the "abhi-dark" entry below.
 */
export const DEFAULT_PALETTE = [
  "hsl(193, 85%, 66%)",
  "hsl(196, 100%, 83%)",
  "hsl(195, 100%, 50%)",
];

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "abhi-dark",
    name: "Abhi Dark",
    type: "gradient",
    colors: ["hsl(193, 85%, 66%)", "hsl(196, 100%, 83%)", "hsl(195, 100%, 50%)"],
    shape: "corners",
    accent: "hsl(193 85% 66%)",
    osAccent: "#0A84FF",
    available: true,
  },
  {
    id: "sequoia-glow",
    name: "Sequoia Glow",
    type: "gradient",
    colors: ["#F97316", "#F59E0B", "#EF4444"],
    shape: "corners",
    accent: "#F5A524",
    osAccent: "#FF9F0A",
    available: true,
  },
  {
    id: "monterey",
    name: "Monterey",
    type: "gradient",
    colors: ["#9333EA", "#6366F1", "#8B5CF6"],
    shape: "corners",
    accent: "#A78BFA",
    osAccent: "#BF5AF2",
    available: true,
  },
  {
    id: "emerald-dunes",
    name: "Emerald Dunes",
    type: "gradient",
    colors: ["#10B981", "#0D9488", "#06B6D4"],
    shape: "corners",
    accent: "#34D399",
    osAccent: "#30D158",
    available: true,
  },
  {
    id: "graphite",
    name: "Graphite",
    type: "gradient",
    colors: ["#3F3F46", "#18181B", "#09090B"],
    shape: "wave",
    accent: "#D4D4D8",
    osAccent: "#98989D",
    available: true,
  },
  {
    id: "attack-on-titan",
    name: "Attack on Titan",
    type: "image",
    src: "/wallpapers/attack-on-titan.png",
    accent: "hsl(0 72% 55%)",
    osAccent: "#FF453A",
    available: true,
  },
  {
    id: "chainsaw-man",
    name: "Chainsaw Man",
    type: "image",
    src: "/wallpapers/chainsaw-man.jpg",
    accent: "hsl(8 85% 55%)",
    osAccent: "#FF6961",
    available: true,
  },
  {
    id: "dune",
    name: "Dune",
    type: "image",
    src: "/wallpapers/dune.jpg",
    accent: "hsl(38 70% 55%)",
    osAccent: "#FFD60A",
    available: true,
  },
  {
    id: "mob-psycho",
    name: "Mob Psycho 100",
    type: "image",
    src: "/wallpapers/mob-psycho.png",
    accent: "hsl(210 80% 60%)",
    osAccent: "#64D2FF",
    available: true,
  },
  {
    id: "spider-man",
    name: "Spider-Man",
    type: "image",
    src: "/wallpapers/spider-man.jpg",
    accent: "hsl(350 85% 55%)",
    osAccent: "#FF375F",
    available: true,
  },
  {
    id: "spider-man-logo",
    name: "Spider-Man Logo",
    type: "image",
    src: "/wallpapers/spider-man-logo.png",
    accent: "hsl(0 85% 50%)",
    osAccent: "#FF2D55",
    available: true,
  },
  {
    id: "vinland-saga",
    name: "Vinland Saga",
    type: "image",
    src: "/wallpapers/vinland-saga.jpg",
    accent: "hsl(200 45% 55%)",
    osAccent: "#5AC8FA",
    available: true,
  },
  {
    id: "sea-of-silence",
    name: "Sea of Silence",
    type: "video",
    src: "/wallpapers/sea-of-silence.mp4",
    accent: "hsl(42 90% 55%)",
    osAccent: "#FFD60A",
    available: true,
  },
];