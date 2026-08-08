"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Search,
  User,
  Code2,
  BriefcaseBusiness,
  FolderGit2,
  Mail,
  Terminal,
  Settings,
  FileText,
  Copy,
  Image as ImageIcon,
  Lock,
  RotateCw,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useWindowStore } from "@/store/windowStore";
import { useSystemStore } from "@/store/systemStore";
import { scrollToSection } from "@/lib/navigation";
import { playClick, playPop } from "@/lib/sounds";
import { profile, socials } from "@/constant";
import { cn } from "@/lib/utils";

interface SpotlightSearchProps {
  open: boolean;
  onClose: () => void;
}

interface SpotItem {
  id: string;
  name: string;
  group: "Applications" | "Sections" | "Actions";
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  run: () => void;
}

export const SpotlightSearch = ({ open, onClose }: SpotlightSearchProps) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const openWindow = useWindowStore((s) => s.openWindow);
  const lock = useSystemStore((s) => s.lock);

  const goSection = (id: string) => {
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => scrollToSection(id), 450);
    } else {
      scrollToSection(id);
    }
  };

  const items = useMemo<SpotItem[]>(
    () => [
      {
        id: "terminal",
        name: "Terminal",
        group: "Applications",
        icon: Terminal,
        keywords: ["shell", "console", "bash", "zsh", "cli"],
        run: () => openWindow("terminal", "terminal", "Terminal — zsh"),
      },
      {
        id: "settings",
        name: "System Settings",
        group: "Applications",
        icon: Settings,
        keywords: ["preferences", "wallpaper", "config"],
        run: () => openWindow("settings", "settings", "System Settings"),
      },
      { id: "about", name: "About", group: "Sections", icon: User, keywords: ["bio", "me"], run: () => goSection("about") },
      { id: "skills", name: "Skills", group: "Sections", icon: Code2, keywords: ["tech", "stack"], run: () => goSection("skills") },
      { id: "experience", name: "Experience", group: "Sections", icon: BriefcaseBusiness, keywords: ["work", "job", "aeos"], run: () => goSection("experience") },
      { id: "work", name: "Work", group: "Sections", icon: FolderGit2, keywords: ["projects", "portfolio"], run: () => goSection("work") },
      { id: "contact", name: "Contact", group: "Sections", icon: Mail, keywords: ["email", "reach"], run: () => goSection("contact") },
      {
        id: "resume",
        name: "View Resume",
        group: "Actions",
        icon: FileText,
        keywords: ["cv", "pdf"],
        run: () => window.open("/resume.pdf", "_blank"),
      },
      {
        id: "copy-email",
        name: "Copy Email Address",
        group: "Actions",
        icon: Copy,
        keywords: ["mail", "contact"],
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          toast.success("Email copied to clipboard");
        },
      },
      {
        id: "github",
        name: "Open GitHub",
        group: "Actions",
        icon: FaGithub,
        keywords: ["code", "repos"],
        run: () => window.open(socials.find((s) => s.name === "GitHub")?.url, "_blank"),
      },
      {
        id: "linkedin",
        name: "Open LinkedIn",
        group: "Actions",
        icon: FaLinkedin,
        keywords: ["social", "network"],
        run: () => window.open(socials.find((s) => s.name === "LinkedIn")?.url, "_blank"),
      },
      {
        id: "wallpaper",
        name: "Change Wallpaper…",
        group: "Actions",
        icon: ImageIcon,
        keywords: ["background", "desktop"],
        run: () => openWindow("settings", "settings", "System Settings"),
      },
      {
        id: "lock",
        name: "Lock Screen",
        group: "Actions",
        icon: Lock,
        keywords: ["sleep", "logout"],
        run: () => lock(),
      },
      {
        id: "restart",
        name: "Restart System",
        group: "Actions",
        icon: RotateCw,
        keywords: ["reload", "reboot"],
        run: () => {
          toast("Restarting abhi os…");
          setTimeout(() => window.location.reload(), 700);
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);


  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) {
          playPop();
          onClose();
          item.run();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIndex, onClose]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const groups = useMemo(() => {
    const order: SpotItem["group"][] = ["Applications", "Sections", "Actions"];
    return order
      .map((g) => ({ name: g, items: filtered.filter((i) => i.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <div data-os-chrome className="fixed inset-0 z-[11000]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="pointer-events-none absolute inset-x-0 top-[16vh] mx-auto w-[min(600px,92vw)]"
          >
            <div className="pointer-events-auto overflow-hidden rounded-2xl border border-white/10 bg-[#1C1C1E]/85 shadow-2xl backdrop-blur-2xl">
              <div className="flex h-14 items-center gap-3 border-b border-white/10 px-4">
                <Search className="h-5 w-5 shrink-0 text-white/50" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Spotlight Search"
                  className="w-full bg-transparent text-lg text-white outline-none placeholder:text-white/35"
                />
              </div>

              <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
                {groups.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-white/40">
                    No results for “{query}”
                  </div>
                )}
                {groups.map((group) => (
                  <div key={group.name}>
                    <div className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                      {group.name}
                    </div>
                    {group.items.map((item) => {
                      flatIndex += 1;
                      const idx = flatIndex;
                      const isActive = idx === activeIndex;
                      return (
                        <button
                          key={item.id}
                          data-index={idx}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => {
                            playClick();
                            onClose();
                            item.run();
                          }}
                          className={cn(
                            "flex w-full cursor-default items-center gap-3 px-4 py-2.5 text-left",
                            isActive ? "bg-os-accent text-white" : "text-white/85"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isActive ? "text-white" : "text-white/60"
                            )}
                          />
                          <span className="flex-1 truncate text-sm">
                            {item.name}
                          </span>
                          <span
                            className={cn(
                              "text-xs",
                              isActive ? "text-white/70" : "text-white/35"
                            )}
                          >
                            {item.group === "Applications"
                              ? "Application"
                              : item.group === "Sections"
                                ? "Section"
                                : "Action"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2 text-[11px] text-white/40">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>esc Close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SpotlightSearch;

