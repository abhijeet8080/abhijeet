import { create } from "zustand";
import { PLAYLIST } from "@/constant/music";
import { useSystemStore } from "./systemStore";

/**
 * Single shared Audio element powering the whole OS.
 * Created lazily on first user gesture (autoplay-safe).
 */
let audio: HTMLAudioElement | null = null;
let loadedSrc = "";

const applyVolume = () => {
  if (audio) {
    audio.volume = useSystemStore.getState().volume;
  }
};

const getAudio = (): HTMLAudioElement | null => {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio();
    audio.preload = "metadata";

    audio.addEventListener("timeupdate", () => {
      useMusicStore.getState()._setTime(audio?.currentTime ?? 0);
    });
    audio.addEventListener("loadedmetadata", () => {
      const d = audio?.duration;
      useMusicStore.getState()._setDuration(d && isFinite(d) ? d : 0);
    });
    audio.addEventListener("ended", () => {
      useMusicStore.getState().next();
    });

    applyVolume();
  }
  return audio;
};

interface MusicState {
  trackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  playTrack: (index: number) => void;
  _setTime: (time: number) => void;
  _setDuration: (duration: number) => void;
}

const loadTrack = (index: number, autoplay: boolean) => {
  const a = getAudio();
  if (!a) return;
  const track = PLAYLIST[index];
  if (loadedSrc !== track.src) {
    loadedSrc = track.src;
    a.src = track.src;
  }
  if (autoplay) {
    void a.play().catch(() => {});
  }
};

export const useMusicStore = create<MusicState>((set, get) => ({
  trackIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,

  play: () => {
    loadTrack(get().trackIndex, true);
    set({ isPlaying: true });
  },

  pause: () => {
    audio?.pause();
    set({ isPlaying: false });
  },

  toggle: () => {
    if (get().isPlaying) get().pause();
    else get().play();
  },

  next: () => {
    const nextIndex = (get().trackIndex + 1) % PLAYLIST.length;
    const wasPlaying = get().isPlaying;
    set({ trackIndex: nextIndex, currentTime: 0, duration: 0 });
    loadTrack(nextIndex, wasPlaying);
  },

  prev: () => {
    // Like macOS: if we're a few seconds in, restart the track instead
    if (get().currentTime > 3) {
      get().seek(0);
      return;
    }
    const prevIndex =
      (get().trackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    const wasPlaying = get().isPlaying;
    set({ trackIndex: prevIndex, currentTime: 0, duration: 0 });
    loadTrack(prevIndex, wasPlaying);
  },

  seek: (time) => {
    const a = getAudio();
    if (!a) return;
    a.currentTime = time;
    set({ currentTime: time });
  },

  playTrack: (index) => {
    const safe = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    set({ trackIndex: safe, currentTime: 0, duration: 0, isPlaying: true });
    loadTrack(safe, true);
  },

  _setTime: (time) => set({ currentTime: time }),
  _setDuration: (duration) => set({ duration }),
}));

// Client-only wiring: volume follows the Control Center Sound slider,
// and Sleep pauses playback like a real machine.
if (typeof window !== "undefined") {
  useSystemStore.subscribe((state, prev) => {
    applyVolume();
    if (state.isSleeping && !prev.isSleeping) {
      useMusicStore.getState().pause();
    }
  });
}