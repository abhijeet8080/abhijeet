/**
 * Hand-drawn macOS-style app icons (SVG) for the Dock.
 *
 * Section apps (About, Experience, Skills, Work, Contact) and Finder are
 * tinted from the live --os-accent CSS variable, so they recolor instantly
 * when the wallpaper changes. System icons (Launchpad, Terminal, Settings,
 * Trash) keep their classic identity — like real macOS.
 */

import type { CSSProperties } from "react";

interface IconProps {
  className?: string;
}

/** Shade of the live OS accent: pct% accent mixed with white/black */
const accentMix = (pct: number, withColor: "white" | "black") =>
  `color-mix(in srgb, var(--os-accent) ${pct}%, ${withColor})`;

const stop = (color: string): CSSProperties => ({ stopColor: color });
const fill = (color: string): CSSProperties => ({ fill: color });

export const FinderIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="finder-l" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop(accentMix(45, "white"))} />
        <stop offset="1" style={stop(accentMix(75, "white"))} />
      </linearGradient>
      <linearGradient id="finder-r" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop("var(--os-accent)")} />
        <stop offset="1" style={stop(accentMix(70, "black"))} />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="58" height="58" rx="14" fill="url(#finder-l)" />
    <path d="M32 3h15a14 14 0 0 1 14 14v30a14 14 0 0 1-14 14H32z" fill="url(#finder-r)" />
    <path d="M20 14v9" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M44 14v9" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
    <path d="M32 14v18c0 3.2-2 5.2-5.5 5.2" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M17.5 40.5c4.2 6 9.1 9 14.5 9s10.3-3 14.5-9" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" />
  </svg>
);

/** Monochrome accent tints — light row, pure row, shade row */
const LAUNCHPAD_SHADES = [
  accentMix(35, "white"), accentMix(55, "white"), accentMix(75, "white"),
  "var(--os-accent)", "var(--os-accent)", "var(--os-accent)",
  accentMix(80, "black"), accentMix(65, "black"), accentMix(50, "black"),
];

export const LaunchpadIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="lp-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A3A3C" />
        <stop offset="1" stopColor="#161618" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="58" height="58" rx="14" fill="url(#lp-bg)" />
    {LAUNCHPAD_SHADES.map((color, i) => (
      <rect
        key={i}
        x={13 + (i % 3) * 14}
        y={13 + Math.floor(i / 3) * 14}
        width="10"
        height="10"
        rx="3"
        style={fill(color)}
      />
    ))}
  </svg>
);

/** About — person silhouette on an accent gradient */
export const AboutIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="about-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop(accentMix(80, "white"))} />
        <stop offset="1" style={stop(accentMix(85, "black"))} />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="58" height="58" rx="14" fill="url(#about-bg)" />
    <circle cx="32" cy="24.5" r="8.5" fill="#fff" />
    <path d="M17 52c2.2-10.6 8-15.5 15-15.5S44.8 41.4 47 52z" fill="#fff" />
  </svg>
);

/** Experience — briefcase on an accent gradient */
export const ExperienceIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="exp-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop(accentMix(80, "white"))} />
        <stop offset="1" style={stop(accentMix(85, "black"))} />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="58" height="58" rx="14" fill="url(#exp-bg)" />
    <rect x="13" y="24" width="38" height="23" rx="4.5" fill="#fff" />
    <path
      d="M25 24v-3.5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4V24"
      stroke="#fff"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <rect x="13" y="32.5" width="38" height="2.5" style={fill("var(--os-accent)")} opacity="0.45" />
    <rect x="28.5" y="30" width="7" height="7" rx="1.8" style={fill("var(--os-accent)")} />
  </svg>
);

/** Skills — code glyph on dark (glyph follows the accent) */
export const CodeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="code-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#263042" />
        <stop offset="1" stopColor="#0B1220" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="58" height="58" rx="14" fill="url(#code-bg)" />
    <text
      x="32"
      y="42"
      textAnchor="middle"
      fontSize="22"
      fontWeight="700"
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      style={fill("var(--os-accent)")}
    >
      &lt;/&gt;
    </text>
  </svg>
);

/** Work — macOS folder, tinted from the accent */
export const FolderIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="fold-front" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop("var(--os-accent)")} />
        <stop offset="1" style={stop(accentMix(75, "black"))} />
      </linearGradient>
    </defs>
    <path
      d="M7 17a6 6 0 0 1 6-6h11.5l5 6H51a6 6 0 0 1 6 6v3H7z"
      style={fill(accentMix(65, "white"))}
    />
    <rect x="5" y="22" width="54" height="33" rx="7" fill="url(#fold-front)" />
  </svg>
);

/** Contact — Mail envelope on an accent gradient */
export const MailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="mail-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop(accentMix(75, "white"))} />
        <stop offset="1" style={stop(accentMix(80, "black"))} />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="58" height="58" rx="14" fill="url(#mail-bg)" />
    <rect x="13" y="19" width="38" height="27" rx="3" fill="#fff" />
    <path
      d="M14.5 20.5L32 34l17.5-13.5"
      style={{ stroke: accentMix(60, "white") }}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TerminalIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="term-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop(accentMix(18, "black"))} />
        <stop offset="1" stopColor="#050507" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="58" height="58" rx="14" fill="url(#term-bg)" />
    <rect x="3" y="3" width="58" height="16" rx="14" fill="#fff" opacity="0.05" />
    <text
      x="13"
      y="41"
      fontSize="26"
      fontWeight="700"
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      style={fill("var(--os-accent)")}
    >
      &gt;
    </text>
    <rect x="30" y="36" width="13" height="4.5" rx="1" style={fill("var(--os-accent)")} />
  </svg>
);

export const SettingsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="set-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop(accentMix(80, "white"))} />
        <stop offset="1" style={stop(accentMix(85, "black"))} />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="58" height="58" rx="14" fill="url(#set-bg)" />
    <g transform="translate(32 33)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="-2.6"
          y="-17"
          width="5.2"
          height="8"
          rx="2.4"
          fill="#fff"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="12.5" fill="#fff" />
      {/* "punched" hole — refilled with the same gradient */}
      <circle r="5" fill="url(#set-bg)" />
    </g>
  </svg>
);

export const TrashIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <defs>
      <linearGradient id="trash-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={stop(accentMix(14, "white"))} />
        <stop offset="1" style={stop(accentMix(32, "white"))} />
      </linearGradient>
    </defs>
    <circle cx="43" cy="11" r="4" fill="#fff" style={{ stroke: accentMix(30, "white") }} strokeWidth="1" />
    <rect x="25" y="9" width="14" height="5" rx="2.5" style={fill(accentMix(22, "white"))} />
    <rect x="12" y="13" width="40" height="5" rx="2.5" style={fill(accentMix(22, "white"))} />
    <path d="M16 20h32l-3.2 32a7 7 0 0 1-7 6.3H26.2a7 7 0 0 1-7-6.3z" fill="url(#trash-bg)" />
    <path
      d="M25 25v27M32 25v27M39 25v27"
      style={{ stroke: accentMix(45, "black") }}
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

