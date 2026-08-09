"use client";

import { AnimatePresence, motion } from "motion/react";
import { Terminal, Image as ImageIcon, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useCodingStats } from "@/hooks/useCodingStats";
import { useSystemStore } from "@/store/systemStore";

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const CalendarWidget = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[13px] font-semibold text-os-accent">
          {now.toLocaleDateString("en-US", { month: "long" })}
        </span>
        <span className="text-[13px] font-medium text-white/60">{year}</span>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="text-[10px] font-semibold text-white/40">
            {d}
          </span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            className={
              day === today
                ? "mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-os-accent text-[10px] font-bold text-white"
                : "text-[11px] text-white/75"
            }
          >
            {day ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
};

const GithubWidget = () => {
  const { github, loading } = useCodingStats();
  const stats = [
    { label: "Repos", value: github?.repos ?? 0 },
    { label: "Commits", value: github?.commits ?? "–" },
    { label: "12 Mo", value: github?.commitsRecent ?? "–" },
    { label: "Langs", value: github?.languages ?? "–" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl">
      <div className="mb-2.5 flex items-center gap-2">
        <FaGithub className="h-4 w-4 text-white/80" />
        <span className="text-[13px] font-semibold text-white/90">
          @{github?.handle ?? "abhijeet8080"}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-[15px] font-bold text-white">
              {loading ? "–" : s.value ?? 0}
            </div>
            <div className="text-[9px] uppercase tracking-wide text-white/45">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const NOTIFICATIONS = [
  {
    icon: Sparkles,
    title: "Welcome to abhi os",
    body: "This entire site runs like a tiny operating system. Press ⌘K anytime to search everything.",
    time: "now",
  },
  {
    icon: Terminal,
    title: "Tip: Terminal",
    body: "Open the Terminal from the Dock and type `help` — it knows my resume, projects, and socials.",
    time: "1m ago",
  },
  {
    icon: ImageIcon,
    title: "Wallpapers",
    body: "Apple menu → System Settings → Wallpaper to change your desktop background.",
    time: "2m ago",
  },
];

export const NotificationCenter = ({
  open,
  onClose,
}: NotificationCenterProps) => {
  const focusDND = useSystemStore((s) => s.focusDND);

  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            data-os-chrome
            className="fixed inset-0 z-[10400] cursor-default"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            data-os-chrome
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="fixed bottom-0 right-0 top-7 z-[10500] w-[min(360px,100vw)] select-none overflow-y-auto p-3"
          >
            <div className="flex flex-col gap-3">
              <CalendarWidget />
              <GithubWidget />

              {focusDND && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-center text-[11px] text-white/50 backdrop-blur-xl">
                  Do Not Disturb is on — notifications are silenced
                </div>
              )}

              {!focusDND &&
                NOTIFICATIONS.map((n) => (
                  <motion.div
                    key={n.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-os-accent">
                        <n.icon className="h-3.5 w-3.5 text-white" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-[12px] font-semibold text-white/90">
                            {n.title}
                          </span>
                          <span className="shrink-0 text-[10px] text-white/40">
                            {n.time}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-white/60">
                          {n.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
