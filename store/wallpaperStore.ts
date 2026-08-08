import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WallpaperState {
  currentId: string;
  setWallpaper: (id: string) => void;
}

export const useWallpaperStore = create<WallpaperState>()(
  persist(
    (set) => ({
      currentId: "abhi-dark",
      setWallpaper: (id) => set({ currentId: id }),
    }),
    {
      name: "abhi-os:wallpaper",
    }
  )
);