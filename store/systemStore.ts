import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SystemState {
  wifi: boolean;
  bluetooth: boolean;
  airdrop: boolean;
  focusDND: boolean;
  /** 0.4 – 1, drives a real screen-dimming overlay */
  brightness: number;
  /** 0 – 1, drives UI sound effects */
  volume: number;
  soundEnabled: boolean;
  isLocked: boolean;
  isSleeping: boolean;
  spotlightOpen: boolean;
  setSpotlightOpen: (open: boolean) => void;
  toggleSpotlight: () => void;
  toggleWifi: () => void;
  toggleBluetooth: () => void;
  toggleAirdrop: () => void;
  toggleFocus: () => void;
  setBrightness: (value: number) => void;
  setVolume: (value: number) => void;
  toggleSound: () => void;
  lock: () => void;
  unlock: () => void;
  sleep: () => void;
  wake: () => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      wifi: true,
      bluetooth: false,
      airdrop: false,
      focusDND: false,
      brightness: 1,
      volume: 0.5,
      soundEnabled: true,
      isLocked: false,
      isSleeping: false,
      spotlightOpen: false,

      setSpotlightOpen: (open) => set({ spotlightOpen: open }),
      toggleSpotlight: () => set((s) => ({ spotlightOpen: !s.spotlightOpen })),
      toggleWifi: () => set((s) => ({ wifi: !s.wifi })),
      toggleBluetooth: () => set((s) => ({ bluetooth: !s.bluetooth })),
      toggleAirdrop: () => set((s) => ({ airdrop: !s.airdrop })),
      toggleFocus: () => set((s) => ({ focusDND: !s.focusDND })),
      setBrightness: (value) =>
        set({ brightness: Math.min(1, Math.max(0.4, value)) }),
      setVolume: (value) =>
        set({ volume: Math.min(1, Math.max(0, value)) }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      lock: () => set({ isLocked: true }),
      unlock: () => set({ isLocked: false }),
      sleep: () => set({ isSleeping: true }),
      wake: () => set({ isSleeping: false }),
    }),
    {
      name: "abhi-os:system",
      partialize: (state) => ({
        wifi: state.wifi,
        bluetooth: state.bluetooth,
        airdrop: state.airdrop,
        focusDND: state.focusDND,
        brightness: state.brightness,
        volume: state.volume,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);