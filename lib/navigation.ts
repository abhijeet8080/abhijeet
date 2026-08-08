"use client";

import type Lenis from "lenis";

const getLenis = (): Lenis | undefined =>
  typeof window === "undefined"
    ? undefined
    : (window as unknown as { lenis?: Lenis }).lenis;

/**
 * Scrolls to a section by element id, using the global Lenis instance
 * when available (falls back to native smooth scrolling).
 */
export const scrollToSection = (id: string) => {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -28, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export const scrollToTop = () => {
  if (typeof window === "undefined") return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.4 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};