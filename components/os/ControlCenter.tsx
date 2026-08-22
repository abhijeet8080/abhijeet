"use client";

import { type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bluetooth,
  Moon,
  Pause,
  Play,
  SkipForward,
  Sun,
  Volume2,
  Wifi,
  Radio,
} from "lucide-react";
import { useSystemStore } from "@/store/systemStore";
import { useMusicStore } from "@/store/musicStore";
import { PLAYLIST } from "@/constant/music";
import { TrackCover } from "./NowPlaying";
import { playClick } from "@/lib/sounds";
import { OS_MENU_TRANSITION } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  glassEffect,
  GlassEffectContainer,
} from "@/components/ui/liquid-glass";

interface ControlCenterProps {
  open: boolean;
  onClose: () => void;
}

interface ToggleCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel: string;
  active: boolean;
  onToggle: () => void;
}

const ToggleCard = ({
  icon: Icon,
  label,
  sublabel,
  active,
  onToggle,
}: ToggleCardProps) => (
  <button
    onClick={() => {
      playClick();
      onToggle();
    }}
    className={cn(
      "flex cursor-default items-center gap-2.5 rounded-xl p-2.5 text-left",
      /* .interactive() — toggleable control: it responds to the pointer. */
      glassEffect({ shape: "none", interactive: true })
    )}
  >
    <span
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
        active ? "bg-os-accent text-white" : "bg-white/20 text-white/70"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
    <span className="min-w-0">
      <span className="block truncate text-[12px] font-medium text-white/90">
        {label}
      </span>
      <span className="block truncate text-[11px] text-white/50">
        {sublabel}
      </span>
    </span>
  </button>
);

const SliderRow = ({
  icon: Icon,
  label,
  value,
  min,
  max,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("rounded-xl p-3", glassEffect({ shape: "none" }))}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-white/70" />
        <span className="text-[12px] font-medium text-white/90">{label}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="os-slider w-full"
        style={{ "--fill": `${pct}%` } as CSSProperties}
        aria-label={label}
      />
    </div>
  );
};

/** Mini Now Playing card — appears once playback has started (like macOS CC) */
const NowPlayingCard = () => {
  const { trackIndex, isPlaying, currentTime, toggle, next } = useMusicStore();
  const hasStarted = isPlaying || currentTime > 0;
  if (!hasStarted) return null;

  const track = PLAYLIST[trackIndex];

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl p-2.5",
        glassEffect({ shape: "none" })
      )}
    >
      <TrackCover track={track} className="h-9 w-9 rounded-lg" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-semibold text-white/90">
          {track.title}
        </div>
        <div className="truncate text-[10px] text-white/50">{track.artist}</div>
      </div>
      <button
        onClick={() => {
          playClick();
          toggle();
        }}
        className="text-white/85 transition-colors hover:text-white"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="h-4 w-4 fill-current" />
        )}
      </button>
      <button
        onClick={() => {
          playClick();
          next();
        }}
        className="text-white/60 transition-colors hover:text-white"
        aria-label="Next track"
      >
        <SkipForward className="h-4 w-4 fill-current" />
      </button>
    </div>
  );
};


export const ControlCenter = ({ open, onClose }: ControlCenterProps) => {
  const {
    wifi,
    bluetooth,
    airdrop,
    focusDND,
    brightness,
    volume,
    toggleWifi,
    toggleBluetooth,
    toggleAirdrop,
    toggleFocus,
    setBrightness,
    setVolume,
  } = useSystemStore();

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
          <motion.div
            data-os-chrome
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={OS_MENU_TRANSITION}
            className={cn(
              "fixed right-2 top-8 z-[10500] w-[min(320px,calc(100vw-16px))] rounded-[18px] p-2.5 select-none",
              /* Translucent glass panel — no opaque backing (skill anti-pattern). */
              glassEffect({ shape: "none" })
            )}
          >
            <GlassEffectContainer spacing={10} className="grid grid-cols-2 gap-2.5">
              <ToggleCard
                icon={Wifi}
                label="Wi-Fi"
                sublabel={wifi ? "abhi-os-5G" : "Off"}
                active={wifi}
                onToggle={toggleWifi}
              />
              <ToggleCard
                icon={Bluetooth}
                label="Bluetooth"
                sublabel={bluetooth ? "On" : "Off"}
                active={bluetooth}
                onToggle={toggleBluetooth}
              />
              <ToggleCard
                icon={Radio}
                label="AirDrop"
                sublabel={airdrop ? "Contacts Only" : "Off"}
                active={airdrop}
                onToggle={toggleAirdrop}
              />
              <ToggleCard
                icon={Moon}
                label="Focus"
                sublabel={focusDND ? "Do Not Disturb" : "Off"}
                active={focusDND}
                onToggle={toggleFocus}
              />
            </GlassEffectContainer>

            <GlassEffectContainer spacing={10} className="mt-2.5 flex flex-col gap-2.5">
              <SliderRow
                icon={Sun}
                label="Display"
                value={brightness}
                min={0.4}
                max={1}
                onChange={setBrightness}
              />
              <SliderRow
                icon={Volume2}
                label="Sound"
                value={volume}
                min={0}
                max={1}
                onChange={setVolume}
              />
              <NowPlayingCard />
            </GlassEffectContainer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ControlCenter;