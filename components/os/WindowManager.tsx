"use client";

import { useEffect } from "react";
import { useWindowStore } from "@/store/windowStore";
import { AppWindow } from "./AppWindow";
import {
  BrightnessOverlay,
  LockScreen,
  SleepOverlay,
} from "./SystemOverlays";
import { TerminalWindow } from "@/components/windows/TerminalWindow";
import { SettingsWindow } from "@/components/windows/SettingsWindow";

/**
 * Renders every open window plus the global system overlays.
 * Adding a new app = add a WindowType + a case here.
 */
export const WindowManager = () => {
  const windows = useWindowStore((s) => s.windows);

  // Clicking anywhere outside a window (desktop, page content) minimizes the
  // active window — OS chrome (menu bar, dock, panels) is excluded.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-app-window]")) return;
      if (target.closest("[data-os-chrome]")) return;

      const { activeWindowId, windows: wins, minimizeWindow } =
        useWindowStore.getState();
      const active = activeWindowId ? wins[activeWindowId] : null;
      if (active && active.isOpen && !active.isMinimized && !active.isClosing) {
        minimizeWindow(active.id);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <>
      {Object.values(windows)
        .filter((win) => win.isOpen)
        .map((win) => {
          switch (win.type) {
            case "terminal":
              return (
                <AppWindow key={win.id} win={win} width={680} height={440}>
                  <TerminalWindow />
                </AppWindow>
              );
            case "settings":
              return (
                <AppWindow key={win.id} win={win} width={760} height={500}>
                  <SettingsWindow />
                </AppWindow>
              );
            default:
              return null;
          }
        })}

      <BrightnessOverlay />
      <SleepOverlay />
      <LockScreen />
    </>
  );
};

export default WindowManager;