"use client";

import { AnimatePresence, motion } from "motion/react";
import { Music, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useMusicStore } from "@/store/musicStore";
import { PLAYLIST, type Track } from "@/constant/music";
import { playClick } from "@/lib/sounds";
import { cn } from "@/lib/utils";

/** Animated bars shown while audio is playing (macOS Now Playing style) */
export const Equalizer = ({
  playing,
  className,
}: {
  playing: boolean;
  className?: string;
}) => (
  <div className={cn("flex items-end gap-[2.5px]", className)}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="eq-bar w-[3px] rounded-full bg-white/75"
        style={{
          height: "100%",
          animationDelay: `${i * 0.16}s`,
          animationDuration: `${0.72 + i * 0.18}s`,
          animationPlayState: playing ? "running" : "paused",
          transform: playing ? undefined : "scaleY(0.3)",
        }}
      />
    ))}
  </div>
);

export const TrackCover = ({
  track,
  className,
}: {
  track: Track;
  className?: string;
}) => (
  <div
    className={cn(
      "flex shrink-0 items-center justify-center rounded-xl border border-white/10 shadow-lg",
      className
    )}
    style={{
      background: `linear-gradient(135deg, ${track.colors[0]}, ${track.colors[1]})`,
    }}
  >
    <Music className="h-1/2 w-1/2 text-white/90" />
  </div>
);

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const UpNextRow = ({ index }: { index: number }) => {
  const track = PLAYLIST[index];
  const { trackIndex, isPlaying, playTrack } = useMusicStore();
  const isActive = index === trackIndex;

  return (
    <button
      onClick={() => {
        playClick();
        playTrack(index);
      }}
      className={cn(
        "flex cursor-default items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors",
        isActive ? "bg-white/10" : "hover:bg-white/5"
      )}
    >
      <TrackCover track={track} className="h-7 w-7 rounded-md" />
      <span
        className={cn(
          "flex-1 truncate text-[12px]",
          isActive ? "font-semibold text-white" : "text-white/75"
        )}
      >
        {track.title}
      </span>
      {isActive && <Equalizer playing={isPlaying} className="h-2.5 w-3" />}
    </button>
  );
};

interface NowPlayingProps {
  open: boolean;
  onClose: () => void;
}

export const NowPlaying = ({ open, onClose }: NowPlayingProps) => {
  const {
    trackIndex,
    isPlaying,
    currentTime,
    duration,
    toggle,
    next,
    prev,
    seek,
  } = useMusicStore();

  const track = PLAYLIST[trackIndex];
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const remaining = duration > 0 ? Math.max(0, duration - currentTime) : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

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
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed right-2 top-8 z-[10500] w-[min(340px,calc(100vw-16px))] rounded-[18px] border border-white/10 bg-[#1E1E20]/80 p-3.5 shadow-2xl backdrop-blur-2xl select-none sm:right-14"
          >
            {/* Track row */}
            <div className="flex items-center gap-3">
              <TrackCover track={track} className="h-14 w-14" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-white/90">
                  {track.title}
                </div>
                <div className="truncate text-[11px] text-white/50">
                  {track.artist}
                </div>
              </div>
              <Equalizer playing={isPlaying} className="h-3.5 w-4 shrink-0" />
            </div>

            {/* Transport controls */}
            <div className="mt-3.5 flex items-center justify-center gap-8">
              <button
                onClick={() => {
                  playClick();
                  prev();
                }}
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Previous track"
              >
                <SkipBack className="h-5 w-5 fill-current" />
              </button>
              <button
                onClick={() => {
                  playClick();
                  toggle();
                }}
                className="text-white transition-transform hover:scale-105 active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 fill-current" />
                ) : (
                  <Play className="h-6 w-6 fill-current" />
                )}
              </button>
              <button
                onClick={() => {
                  playClick();
                  next();
                }}
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Next track"
              >
                <SkipForward className="h-5 w-5 fill-current" />
              </button>
            </div>

            {/* Progress */}
            <div className="mt-3.5">
              <div
                className="relative h-1.5 w-full cursor-pointer rounded-full bg-white/15"
                onClick={handleSeek}
                role="slider"
                aria-label="Seek"
                aria-valuenow={Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-os-accent transition-[width] duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] tabular-nums text-white/55">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(remaining)}</span>
              </div>
            </div>

            {/* Up next */}
            <div className="mt-2 border-t border-white/10 pt-2.5">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                Up Next
              </div>
              <div className="flex flex-col gap-0.5">
                {PLAYLIST.map((t, i) => (
                  <UpNextRow key={t.id} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NowPlaying;

