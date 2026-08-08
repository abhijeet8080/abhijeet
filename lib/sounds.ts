"use client";

import { useSystemStore } from "@/store/systemStore";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  return audioCtx;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  gainValue: number
) {
  const { soundEnabled, volume } = useSystemStore.getState();
  if (!soundEnabled || volume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(gainValue * volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

/** Tiny UI tick — menu opens, dock clicks */
export const playClick = () => tone(1400, 0.04, "sine", 0.06);

/** Slightly deeper pop — window open/close */
export const playPop = () => tone(520, 0.09, "sine", 0.09);

/** Mechanical-key style double tick — terminal key presses */
export const playThocc = () => {
  tone(900, 0.03, "triangle", 0.05);
  setTimeout(() => tone(1600, 0.02, "sine", 0.03), 12);
};

/** Error buzz */
export const playError = () => tone(180, 0.15, "sawtooth", 0.05);