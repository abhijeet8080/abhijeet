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

export const DEFAULT_WALLPAPER_ID = "sequoia-glow";

export const DEFAULT_ACCENT = "#F5A524";
export const DEFAULT_OS_ACCENT = "#FF9F0A";

/**
 * Gradient stops of the default wallpaper — used as the initial accent palette
 * (bento card washes, photo backdrop) before/while the live one is derived.
 * Kept in sync with the "sequoia-glow" entry below.
 */
export const DEFAULT_PALETTE = ["#F97316", "#F59E0B", "#EF4444"];

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "sonoma",
    name: "Sonoma",
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
    id: "ventura",
    name: "Ventura",
    type: "gradient",
    colors: ["#EC4899", "#A855F7", "#6366F1"],
    shape: "ripple",
    accent: "#F472B6",
    osAccent: "#FF375F",
    available: true,
  },
  {
    id: "big-sur",
    name: "Big Sur",
    type: "gradient",
    colors: ["#38BDF8", "#0284C7", "#1E3A8A"],
    shape: "blob",
    accent: "#38BDF8",
    osAccent: "#0A84FF",
    available: true,
  },
  {
    id: "tahoe",
    name: "Tahoe",
    type: "gradient",
    colors: ["#BFDBFE", "#60A5FA", "#1D4ED8"],
    shape: "sphere",
    accent: "#93C5FD",
    osAccent: "#5AC8FA",
    available: true,
  },
  {
    id: "catalina",
    name: "Catalina",
    type: "gradient",
    colors: ["#FB7185", "#F97316", "#FBBF24"],
    shape: "dots",
    accent: "#FB923C",
    osAccent: "#FF9500",
    available: true,
  },
  {
    id: "mojave",
    name: "Mojave",
    type: "gradient",
    colors: ["#D97706", "#92400E", "#6D28D9"],
    shape: "truchet",
    accent: "#F59E0B",
    osAccent: "#AC8E68",
    available: true,
  },
  {
    id: "aurora",
    name: "Aurora",
    type: "gradient",
    colors: ["#22D3EE", "#34D399", "#A78BFA"],
    shape: "wave",
    accent: "#34D399",
    osAccent: "#30D158",
    available: true,
  },
  {
    id: "midnight",
    name: "Midnight",
    type: "gradient",
    colors: ["#1E1B4B", "#312E81", "#4C1D95"],
    shape: "corners",
    accent: "#818CF8",
    osAccent: "#5E5CE6",
    available: true,
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    type: "gradient",
    colors: ["#FDA4AF", "#F9A8D4", "#E879F9"],
    shape: "ripple",
    accent: "#F472B6",
    osAccent: "#FF375F",
    available: true,
  },
  {
    id: "high-sierra",
    name: "High Sierra",
    type: "gradient",
    colors: ["#9CA3AF", "#4B5563", "#065F46"],
    shape: "blob",
    accent: "#6EE7B7",
    osAccent: "#30D158",
    available: true,
  },
  {
    id: "sunset-ridge",
    name: "Sunset Ridge",
    type: "gradient",
    colors: ["#BE185D", "#DC2626", "#F59E0B"],
    shape: "sphere",
    accent: "#F87171",
    osAccent: "#FF453A",
    available: true,
  },
  {
    id: "obsidian",
    name: "Obsidian",
    type: "gradient",
    colors: ["#18181B", "#27272A", "#581C87"],
    shape: "dots",
    accent: "#C084FC",
    osAccent: "#BF5AF2",
    available: true,
  },
  {
    id: "neon-pulse",
    name: "Neon Pulse",
    type: "gradient",
    colors: ["#06B6D4", "#D946EF", "#84CC16"],
    shape: "truchet",
    accent: "#22D3EE",
    osAccent: "#64D2FF",
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