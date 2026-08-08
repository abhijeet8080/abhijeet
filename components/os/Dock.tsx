"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { toast } from "sonner";

import {
  AboutIcon,
  CodeIcon,
  ExperienceIcon,
  FinderIcon,
  FolderIcon,
  LaunchpadIcon,
  MailIcon,
  SettingsIcon,
  TerminalIcon,
  TrashIcon,
} from "./icons";
import { useWindowStore, type WindowType } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToSection, scrollToTop } from "@/lib/navigation";
import { playClick } from "@/lib/sounds";

/** Grace period before hiding once the pointer leaves the dock/edge-zone — avoids flicker. */
const HIDE_DELAY_MS = 350;
/** How long the dock stays revealed after a window is minimized, so you can see where it went. */
const MINIMIZE_PEEK_MS = 1500;
/** How long the dock stays revealed after an upward scroll. */
const SCROLL_PEEK_MS = 1600;

type IconComponent = React.ComponentType<{ className?: string }>;

type DockAction =
  | { kind: "top" }
  | { kind: "scroll"; target: string }
  | { kind: "spotlight" }
  | { kind: "window"; id: string; type: WindowType; title: string }
  | { kind: "trash" };

interface DockApp {
  id: string;
  name: string;
  icon: IconComponent;
  action: DockAction;
  /** Finder is always "running" like on macOS */
  alwaysRunning?: boolean;
}

const APPS: DockApp[] = [
  { id: "finder", name: "Finder", icon: FinderIcon, action: { kind: "top" }, alwaysRunning: true },
  { id: "launchpad", name: "Launchpad", icon: LaunchpadIcon, action: { kind: "spotlight" } },
  { id: "about", name: "About", icon: AboutIcon, action: { kind: "scroll", target: "about" } },
  { id: "experience", name: "Experience", icon: ExperienceIcon, action: { kind: "scroll", target: "experience" } },
  { id: "skills", name: "Skills", icon: CodeIcon, action: { kind: "scroll", target: "skills" } },
  { id: "work", name: "Work", icon: FolderIcon, action: { kind: "scroll", target: "work" } },
  { id: "contact", name: "Contact", icon: MailIcon, action: { kind: "scroll", target: "contact" } },
  { id: "terminal", name: "Terminal", icon: TerminalIcon, action: { kind: "window", id: "terminal", type: "terminal", title: "Terminal — zsh" } },
  { id: "settings", name: "System Settings", icon: SettingsIcon, action: { kind: "window", id: "settings", type: "settings", title: "System Settings" } },
];

/** Distance-based magnification for one dock cell (static on mobile) */
const useMagnify = (
  mouseX: MotionValue<number>,
  ref: React.RefObject<HTMLButtonElement | null>,
  base: number,
  max: number
) => {
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const widthSync = useTransform(distance, [-90, 0, 90], [base, max, base]);
  return useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 14 });
};

const Tooltip = ({ label }: { label: string }) => (
  <div className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 rounded-md border border-white/10 bg-[#2C2C2E]/90 px-2.5 py-1 text-[12px] font-medium whitespace-nowrap text-white/90 opacity-0 shadow-lg backdrop-blur-xl transition-opacity duration-150 group-hover:opacity-100 md:block">
    {label}
  </div>
);

interface DockIconProps {
  app: DockApp;
  mouseX: MotionValue<number>;
  isRunning: boolean;
  iconSize: [number, number];
  onActivate: (app: DockApp) => void;
}

const DockIcon = ({
  app,
  mouseX,
  isRunning,
  iconSize,
  onActivate,
}: DockIconProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const size = useMagnify(mouseX, ref, iconSize[0], iconSize[1]);

  return (
    <div className="group relative flex flex-col items-center">
      <Tooltip label={app.name} />
      <motion.button
        ref={ref}
        onClick={() => onActivate(app)}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.88 }}
        className="cursor-default overflow-hidden"
        aria-label={app.name}
      >
        <app.icon className="h-full w-full" />
      </motion.button>
      <span
        className={`absolute -bottom-1.5 h-1 w-1 rounded-full bg-white/90 shadow transition-opacity duration-300 ${
          isRunning ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

interface MinimizedThumbProps {
  id: string;
  title: string;
  mouseX: MotionValue<number>;
  iconSize: [number, number];
}

const MinimizedThumb = ({
  id,
  title,
  mouseX,
  iconSize,
}: MinimizedThumbProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const size = useMagnify(mouseX, ref, iconSize[0], iconSize[1]);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  return (
    <div className="group relative flex flex-col items-center self-center">
      <Tooltip label={title} />
      <motion.button
        ref={ref}
        onClick={() => {
          playClick();
          focusWindow(id);
        }}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.88 }}
        className="cursor-default overflow-hidden rounded-md border border-white/20 bg-zinc-900 shadow-lg"
        aria-label={`Restore ${title}`}
      >
        {/* Fake window preview */}
        <div className="flex h-full w-full flex-col">
          <div className="flex h-[18%] min-h-1.5 items-center gap-0.5 bg-zinc-700/70 px-1">
            <span className="h-[3px] w-[3px] rounded-full bg-[#FF5F57]" />
            <span className="h-[3px] w-[3px] rounded-full bg-[#FEBC2E]" />
            <span className="h-[3px] w-[3px] rounded-full bg-[#28C840]" />
          </div>
          <div className="flex flex-1 flex-col gap-[2px] p-1">
            <div className="h-[2px] w-4/5 rounded bg-zinc-600/70" />
            <div className="h-[2px] w-3/5 rounded bg-zinc-600/50" />
            <div className="h-[2px] w-2/3 rounded bg-zinc-600/40" />
          </div>
        </div>
      </motion.button>
    </div>
  );
};

export const Dock = () => {
  const mouseX = useMotionValue(Infinity);
  const isMobile = useIsMobile();

  // `hidden` is only ever changed inside real event handlers (or a store
  // subscription callback below) — never synchronously inside an effect
  // body, so a debounced hide can't race a reveal.
  const [hidden, setHidden] = useState(true);
  /** Mobile-only visibility driver: hide on scroll down, reveal on scroll up. */
  const [scrollHidden, setScrollHidden] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** True while the pointer is over the dock — scroll-down never hides it then. */
  const hoverRef = useRef(false);

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  // Cancels any pending hide and shows the dock immediately.
  const reveal = useCallback(() => {
    clearHideTimer();
    setHidden(false);
  }, [clearHideTimer]);

  // Hides after a short grace period, so briefly crossing the gap between
  // the edge zone and the dock (or a jittery mouse) doesn't cause flicker —
  // reveal() cancels this if the pointer lands somewhere else that counts.
  const scheduleHide = useCallback(
    (delay = HIDE_DELAY_MS) => {
      clearHideTimer();
      hideTimer.current = setTimeout(() => setHidden(true), delay);
    },
    [clearHideTimer]
  );

  useEffect(() => clearHideTimer, [clearHideTimer]);

  const { windows, openWindow, focusWindow, minimizeWindow, activeWindowId } =
    useWindowStore();
  const toggleSpotlight = useSystemStore((s) => s.toggleSpotlight);

  // Compact static icons on touch, magnifying icons on desktop
  const iconSize: [number, number] = isMobile ? [36, 36] : [48, 82];

  const minimizedWindows = Object.values(windows).filter(
    (w) => w.isOpen && w.isMinimized
  );

  // Peek the dock whenever a window is freshly minimized, like the genie
  // effect on macOS — the user should see where the window landed even if
  // their pointer isn't anywhere near the bottom edge. Subscribing directly
  // to the store (rather than diffing a derived count in an effect body)
  // keeps the setState call inside a callback that only runs in response to
  // an actual external change, not on every render.
  useEffect(() => {
    const countMinimized = (ws: typeof windows) =>
      Object.values(ws).filter((w) => w.isOpen && w.isMinimized).length;
    let prevCount = countMinimized(useWindowStore.getState().windows);

    return useWindowStore.subscribe((state) => {
      const nextCount = countMinimized(state.windows);
      if (nextCount > prevCount) {
        reveal();
        scheduleHide(MINIMIZE_PEEK_MS);
      }
      prevCount = nextCount;
    });
  }, [reveal, scheduleHide]);

  // Scroll-direction visibility: scrolling up reveals the dock (a quick peek
  // on desktop — re-hides unless hovered; persistent on mobile), scrolling
  // down tucks it away for more reading room. Works with Lenis since it
  // still emits native window scroll events.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;
        if (Math.abs(delta) < 4) return; // ignore jitter

        if (delta < 0) {
          // Scrolling up → reveal
          if (isMobile) {
            setScrollHidden(false);
          } else {
            reveal();
            scheduleHide(SCROLL_PEEK_MS);
          }
        } else if (y > 80) {
          // Scrolling down (past the very top) → hide
          if (isMobile) {
            setScrollHidden(true);
          } else if (!hoverRef.current) {
            clearHideTimer();
            setHidden(true);
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, reveal, scheduleHide, clearHideTimer]);

  const handleActivate = (app: DockApp) => {
    playClick();
    const action = app.action;

    if (action.kind === "top") return scrollToTop();
    if (action.kind === "scroll") return scrollToSection(action.target);
    if (action.kind === "spotlight") return toggleSpotlight();
    if (action.kind === "trash") {
      toast("Trash is empty — your code is safe.");
      return;
    }

    // Window apps: open / focus / minimize like macOS
    const win = windows[action.id];
    if (!win || !win.isOpen) {
      openWindow(action.id, action.type, action.title);
    } else if (win.isMinimized || activeWindowId !== action.id) {
      focusWindow(action.id);
    } else {
      minimizeWindow(action.id);
    }
  };

  const isRunning = (app: DockApp) =>
    app.alwaysRunning || !!windows[app.id]?.isOpen;

  return (
    <>
      {/* Bottom-edge hot zone: hovering here reveals the dock, independent of
          whether the pointer goes on to enter the dock itself. Skipped on
          mobile since there's no hover concept — the dock stays visible. */}
      {!isMobile && (
        <div
          aria-hidden
          onMouseEnter={reveal}
          onMouseLeave={() => scheduleHide()}
          className="fixed inset-x-0 bottom-0 z-[590] h-3"
        />
      )}

      <motion.div
        data-os-chrome
        initial={{ y: "140%" }}
        animate={{ y: (isMobile ? scrollHidden : hidden) ? "140%" : "0%" }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className="fixed bottom-2 left-1/2 z-[600] -translate-x-1/2"
      >
        <div
          onMouseEnter={() => {
            hoverRef.current = true;
            reveal();
          }}
          onMouseLeave={() => {
            hoverRef.current = false;
            scheduleHide();
            mouseX.set(Infinity);
          }}
          onMouseMove={(e) => mouseX.set(e.clientX)}
          className="flex max-w-[calc(100vw-12px)] items-end gap-[3px] overflow-x-auto rounded-[20px] border border-white/15 bg-white/10 px-1.5 py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:gap-1 md:rounded-[24px]"
        >
          {APPS.map((app) => (
            <DockIcon
              key={app.id}
              app={app}
              mouseX={mouseX}
              isRunning={isRunning(app)}
              iconSize={iconSize}
              onActivate={handleActivate}
            />
          ))}

          {/* Minimized windows (like macOS) */}
          {minimizedWindows.length > 0 && (
            <>
              <div className="mx-1 h-8 w-px shrink-0 self-center bg-white/20 md:h-11" />
              {minimizedWindows.map((w) => (
                <MinimizedThumb
                  key={w.id}
                  id={w.id}
                  title={w.title}
                  mouseX={mouseX}
                  iconSize={iconSize}
                />
              ))}
            </>
          )}

          {/* Separator + Trash */}
          <div className="mx-1 h-8 w-px shrink-0 self-center bg-white/20 md:h-11" />
          <DockIcon
            app={{
              id: "trash",
              name: "Trash",
              icon: TrashIcon,
              action: { kind: "trash" },
            }}
            mouseX={mouseX}
            isRunning={false}
            iconSize={iconSize}
            onActivate={handleActivate}
          />
        </div>
      </motion.div>
    </>
  );
};

export default Dock;

