"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryMedium,
  CirclePlay,
  Search,
  SlidersHorizontal,
  Wifi,
  WifiOff,
} from "lucide-react";
import { FaApple } from "react-icons/fa6";
import { toast } from "sonner";

import { MenuDropdown, type MenuItem } from "./MenuDropdown";
import { ControlCenter } from "./ControlCenter";
import { NotificationCenter } from "./NotificationCenter";
import { SpotlightSearch } from "./SpotlightSearch";
import { NowPlaying, Equalizer } from "./NowPlaying";
import { useMusicStore } from "@/store/musicStore";
import { useWindowStore } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { scrollToSection } from "@/lib/navigation";
import { playClick } from "@/lib/sounds";
import { profile } from "@/constant";
import { cn } from "@/lib/utils";
import {
  glassEffect,
  LG_MORPH_SPRING,
} from "@/components/ui/liquid-glass";

type PanelKind = "none" | "control" | "notifications" | "music";

/**
 * glassEffectID("menubar-active", in: namespace) — one shared glass pill that
 * morphs between whichever menu-bar control is active. The surrounding
 * <LayoutGroup> plays the role of SwiftUI's @Namespace, LG_MORPH_SPRING is the
 * `withAnimation` default, and only ONE pill exists at any moment so the
 * material itself morphs from control to control.
 */
const ActiveGlassPill = () => (
  <motion.span
    layoutId="menubar-active-pill"
    transition={LG_MORPH_SPRING}
    aria-hidden
    className={cn(
      "absolute inset-0 -z-10 rounded",
      glassEffect({ shape: "none" })
    )}
  />
);

export const MenuBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [time, setTime] = useState("");
  const [timeShort, setTimeShort] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [panel, setPanel] = useState<PanelKind>("none");
  const [battery, setBattery] = useState<{
    level: number;
    charging: boolean;
  } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
  } = useWindowStore();
  const { wifi, sleep, lock, spotlightOpen, setSpotlightOpen, toggleSpotlight } =
    useSystemStore();
  const isPlaying = useMusicStore((s) => s.isPlaying);

  const activeWindow = activeWindowId ? windows[activeWindowId] : null;
  const activeAppName = activeWindow?.title ?? "Finder";
  const openWindows = Object.values(windows).filter((w) => w.isOpen);

  // ── Clock (full on desktop, time-only on mobile) ─────────────────────────
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const clock = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      setTime(`${date}  ${clock}`);
      setTimeShort(clock);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Real battery status ──────────────────────────────────────────────────
  useEffect(() => {
    const nav = navigator as unknown as {
      getBattery?: () => Promise<{
        level: number;
        charging: boolean;
        addEventListener: (t: string, cb: () => void) => void;
        removeEventListener: (t: string, cb: () => void) => void;
      }>;
    };
    if (!nav.getBattery) return;

    let cleanup: (() => void) | undefined;
    nav.getBattery().then((batt) => {
      const update = () =>
        setBattery({ level: batt.level, charging: batt.charging });
      update();
      batt.addEventListener("levelchange", update);
      batt.addEventListener("chargingchange", update);
      cleanup = () => {
        batt.removeEventListener("levelchange", update);
        batt.removeEventListener("chargingchange", update);
      };
    });
    return () => cleanup?.();
  }, []);

  // ── Global hotkeys: ⌘K Spotlight, ⌘, Settings, Esc closes ───────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleSpotlight();
        setActiveMenu(null);
        setPanel("none");
      } else if (e.metaKey && e.key === ",") {
        e.preventDefault();
        openWindow("settings", "settings", "System Settings");
      } else if (e.key === "Escape") {
        setActiveMenu(null);
        setPanel("none");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openWindow, toggleSpotlight]);

  // ── Click-outside closes menus ───────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
    setPanel("none");
  }, [pathname]);

  const goSection = (id: string) => {
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => scrollToSection(id), 450);
    } else {
      scrollToSection(id);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const restart = () => {
    toast("Restarting abhi os…");
    setTimeout(() => window.location.reload(), 700);
  };

  const handleMenuClick = (menu: string) => {
    playClick();
    setActiveMenu((m) => (m === menu ? null : menu));
  };

  const handleMenuHover = (menu: string) => {
    if (activeMenu) setActiveMenu(menu);
  };

  const closeMenus = () => setActiveMenu(null);

  // ── Menus ────────────────────────────────────────────────────────────────
  const appleMenu: MenuItem[] = [
    { label: "About abhi os", action: () => { closeMenus(); goSection("about"); } },
    { divider: true },
    { label: "System Settings…", action: () => { closeMenus(); openWindow("settings", "settings", "System Settings"); } },
    { divider: true },
    {
      label: "Force Quit…",
      shortcut: "⌥⌘⎋",
      disabled: !activeWindow,
      action: () => {
        if (activeWindow) {
          toast(`Force Quit “${activeWindow.title}”`);
          closeWindow(activeWindow.id);
        }
        closeMenus();
      },
    },
    { divider: true },
    { label: "Sleep", action: () => { closeMenus(); sleep(); } },
    { label: "Restart…", action: () => { closeMenus(); restart(); } },
    { divider: true },
    { label: "Lock Screen", shortcut: "⌃⌘Q", action: () => { closeMenus(); lock(); } },
  ];

  const appMenu: MenuItem[] = [
    { label: `About ${activeAppName}`, action: () => { closeMenus(); goSection("about"); } },
    { divider: true },
    { label: "Settings…", shortcut: "⇧⌘,", action: () => { closeMenus(); openWindow("settings", "settings", "System Settings"); } },
    { divider: true },
    {
      label: `Quit ${activeAppName}`,
      shortcut: "⌘Q",
      disabled: !activeWindow,
      action: () => {
        if (activeWindow) closeWindow(activeWindow.id);
        closeMenus();
      },
    },
  ];

  const fileMenu: MenuItem[] = [
    { label: "New Terminal", shortcut: "⌘T", action: () => { closeMenus(); openWindow("terminal", "terminal", "Terminal — zsh"); } },
    { divider: true },
    {
      label: "Close Window",
      shortcut: "⌘W",
      disabled: !activeWindow,
      action: () => {
        if (activeWindow) closeWindow(activeWindow.id);
        closeMenus();
      },
    },
  ];

  const editMenu: MenuItem[] = [
    { label: "Undo", shortcut: "⌘Z", disabled: true },
    { label: "Redo", shortcut: "⇧⌘Z", disabled: true },
    { divider: true },
    { label: "Cut", shortcut: "⌘X", disabled: true },
    { label: "Copy", shortcut: "⌘C", disabled: true },
    { label: "Paste", shortcut: "⌘V", disabled: true },
    { label: "Select All", shortcut: "⌘A", disabled: true },
  ];

  const viewMenu: MenuItem[] = [
    { label: "Change Wallpaper…", action: () => { closeMenus(); openWindow("settings", "settings", "System Settings"); } },
    { divider: true },
    { label: "Enter Full Screen", shortcut: "⌃⌘F", action: () => { closeMenus(); toggleFullscreen(); } },
  ];

  const goMenu: MenuItem[] = [
    { label: "About", shortcut: "⌘1", action: () => { closeMenus(); goSection("about"); } },
    { label: "Skills", shortcut: "⌘2", action: () => { closeMenus(); goSection("skills"); } },
    { label: "Experience", shortcut: "⌘3", action: () => { closeMenus(); goSection("experience"); } },
    { label: "Work", shortcut: "⌘4", action: () => { closeMenus(); goSection("work"); } },
    { label: "Contact", shortcut: "⌘5", action: () => { closeMenus(); goSection("contact"); } },
  ];

  const windowMenu: MenuItem[] = [
    {
      label: "Minimize",
      shortcut: "⌘M",
      disabled: !activeWindow,
      action: () => {
        if (activeWindow) minimizeWindow(activeWindow.id);
        closeMenus();
      },
    },
    {
      label: "Zoom",
      disabled: !activeWindow,
      action: () => {
        if (activeWindow) maximizeWindow(activeWindow.id);
        closeMenus();
      },
    },
    { divider: true },
    ...(openWindows.length === 0
      ? [{ label: "No Open Windows", disabled: true } as MenuItem]
      : openWindows.map((w) => ({
          label: `${w.id === activeWindowId ? "✓ " : ""}${w.title}`,
          action: () => {
            focusWindow(w.id);
            closeMenus();
          },
        }))),
  ];

  const helpMenu: MenuItem[] = [
    { label: "abhi os Help", action: () => { closeMenus(); toast.success("You're looking at it! Press ⌘K to search everything."); } },
    { label: "Keyboard Shortcuts", action: () => { closeMenus(); toast.info("⌘K Spotlight · ⌘, Settings · Esc Close panels"); } },
    { divider: true },
    { label: "Contact Support", action: () => { closeMenus(); goSection("contact"); } },
    { label: "Report an Issue", action: () => { closeMenus(); window.open(`mailto:${profile.email}?subject=abhi os issue`, "_blank"); } },
  ];

  const menus: { name: string; items: MenuItem[] }[] = [
    { name: "File", items: fileMenu },
    { name: "Edit", items: editMenu },
    { name: "View", items: viewMenu },
    { name: "Go", items: goMenu },
    { name: "Window", items: windowMenu },
    { name: "Help", items: helpMenu },
  ];


  const batteryPct = Math.round((battery?.level ?? 1) * 100);
  const BatteryIcon = battery?.charging
    ? BatteryCharging
    : batteryPct > 60
      ? BatteryFull
      : batteryPct > 25
        ? BatteryMedium
        : Battery;

  return (
    <>
      <motion.div
        ref={menuRef}
        data-os-chrome
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[10000] flex h-7 items-center justify-between px-3 text-[13px] font-medium text-white/90 select-none md:px-4",
          /* Toolbar glass (skill: "Navigation bars, toolbars, and tab bars")
             in the flat chrome variant — hairline shadow, no card float. */
          glassEffect({ shape: "none" }),
          "lg-glass-flat"
        )}
      >
        {/* LayoutGroup = the @Namespace coordinating the morphing
            ActiveGlassPill between menu-bar controls. */}
        <LayoutGroup>
        {/* ── Left: Apple + app + menus ── */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="relative">
            <button
              onClick={() => handleMenuClick("apple")}
              onMouseEnter={() => handleMenuHover("apple")}
              className={cn(
                "relative isolate flex cursor-default items-center rounded px-2 py-0.5 transition-colors hover:bg-white/10"
              )}
              aria-label="Apple menu"
            >
              {activeMenu === "apple" && <ActiveGlassPill />}
              <FaApple className="h-[15px] w-[15px]" />
            </button>
            <MenuDropdown isOpen={activeMenu === "apple"} items={appleMenu} />
          </div>

          <div className="relative">
            <button
              onClick={() => handleMenuClick("app")}
              onMouseEnter={() => handleMenuHover("app")}
              className={cn(
                "relative isolate max-w-[110px] cursor-default truncate rounded px-2 py-0.5 font-bold tracking-tight transition-colors hover:bg-white/10 sm:max-w-none"
              )}
            >
              {activeMenu === "app" && <ActiveGlassPill />}
              {activeAppName}
            </button>
            <MenuDropdown isOpen={activeMenu === "app"} items={appMenu} />
          </div>

          <div className="hidden items-center md:flex">
            {menus.map((menu) => (
              <div key={menu.name} className="relative">
                <button
                  onClick={() => handleMenuClick(menu.name)}
                  onMouseEnter={() => handleMenuHover(menu.name)}
                  className={cn(
                    "relative isolate cursor-default rounded px-2.5 py-0.5 transition-colors hover:bg-white/10",
                    activeMenu === menu.name && "text-white"
                  )}
                >
                  {activeMenu === menu.name && <ActiveGlassPill />}
                  {menu.name}
                </button>
                <MenuDropdown
                  isOpen={activeMenu === menu.name}
                  items={menu.items}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: status icons + clock ── */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              playClick();
              setPanel((p) => (p === "control" ? "none" : "control"));
            }}
            className={cn(
              "relative isolate hidden cursor-default items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-white/10 sm:flex"
            )}
            aria-label="Wi-Fi"
          >
            {wifi ? (
              <Wifi className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-white/50" />
            )}
          </button>

          <button
            onClick={() => {
              playClick();
              setPanel((p) => (p === "control" ? "none" : "control"));
            }}
            className={cn(
              "relative isolate hidden cursor-default items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-white/10 sm:flex"
            )}
            aria-label="Battery"
          >
            <span className="text-[12px] text-white/70">{batteryPct}%</span>
            <BatteryIcon className="h-4 w-4" />
          </button>

          {/* Now Playing */}
          <button
            onClick={() => {
              playClick();
              setPanel((p) => (p === "music" ? "none" : "music"));
            }}
            className={cn(
              "relative isolate flex cursor-default items-center rounded px-1.5 py-0.5 transition-colors hover:bg-white/10"
            )}
            aria-label="Now Playing"
          >
            {panel === "music" && <ActiveGlassPill />}
            {isPlaying ? (
              <Equalizer playing className="h-3 w-3.5" />
            ) : (
              <CirclePlay className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            onClick={() => {
              playClick();
              toggleSpotlight();
            }}
            className={cn(
              "relative isolate cursor-default rounded px-1.5 py-0.5 transition-colors hover:bg-white/10"
            )}
            aria-label="Spotlight Search"
          >
            {spotlightOpen && <ActiveGlassPill />}
            <Search className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              playClick();
              setPanel((p) => (p === "control" ? "none" : "control"));
            }}
            className={cn(
              "relative isolate cursor-default rounded px-1.5 py-0.5 transition-colors hover:bg-white/10"
            )}
            aria-label="Control Center"
          >
            {panel === "control" && <ActiveGlassPill />}
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => {
              playClick();
              setPanel((p) =>
                p === "notifications" ? "none" : "notifications"
              );
            }}
            className={cn(
              "relative isolate cursor-default rounded px-2 py-0.5 tabular-nums transition-colors hover:bg-white/10"
            )}
            aria-label="Notification Center"
          >
            {panel === "notifications" && <ActiveGlassPill />}
            <span className="hidden sm:inline">{time}</span>
            <span className="sm:hidden">{timeShort}</span>
          </button>
        </div>
        </LayoutGroup>
      </motion.div>

      {/* ── Overlays ── */}
      <ControlCenter
        open={panel === "control"}
        onClose={() => setPanel("none")}
      />
      <NotificationCenter
        open={panel === "notifications"}
        onClose={() => setPanel("none")}
      />
      <NowPlaying
        open={panel === "music"}
        onClose={() => setPanel("none")}
      />
      <SpotlightSearch
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
      />
    </>
  );
};

export default MenuBar;

