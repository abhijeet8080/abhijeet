interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface AccentPair {
  accent: string;
  osAccent: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function rgbToHsl(r: number, g: number, b: number): HSL {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
  }
  return { h: h * 60, s, l };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let rgb: [number, number, number];
  if (hp < 1) rgb = [c, x, 0];
  else if (hp < 2) rgb = [x, c, 0];
  else if (hp < 3) rgb = [0, c, x];
  else if (hp < 4) rgb = [0, x, c];
  else if (hp < 5) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  const m = l - c / 2;
  return [rgb[0] + m, rgb[1] + m, rgb[2] + m];
}

export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l).map((v) => clamp(Math.round(v * 255), 0, 255));
  return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** Parses "#rrggbb", "hsl(h, s%, l%)" or "hsl(h s% l%)" into HSL. */
export function parseColorToHsl(input: string): HSL | null {
  const hex = input.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const int = parseInt(hex[1], 16);
    return rgbToHsl(
      ((int >> 16) & 255) / 255,
      ((int >> 8) & 255) / 255,
      (int & 255) / 255
    );
  }

  const hsl = input
    .trim()
    .match(
      /^hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/i
    );
  if (hsl) {
    return {
      h: parseFloat(hsl[1]),
      s: parseFloat(hsl[2]) / 100,
      l: parseFloat(hsl[3]) / 100,
    };
  }

  return null;
}

/** Builds a UI-ready accent pair (site accent + macOS-style solid) from a hue/saturation. */
function buildAccentPair(h: number, s: number): AccentPair {
  const satPct = clamp(Math.round(s * 100), 55, 88);
  return {
    accent: `hsl(${Math.round(h)} ${satPct}% 62%)`,
    osAccent: hslToHex(h, clamp(s, 0.55, 0.85), 0.55),
  };
}

interface HueBucket {
  weight: number;
  h: number;
  s: number;
  l: number;
}

/**
 * Samples an already-loaded <img> or <video> frame on an offscreen canvas into
 * 10°-wide hue buckets — weighted toward saturated, mid-lightness pixels so a
 * bright subject wins over dark shadows or blown-out sky/highlights.
 */
function sampleHueBuckets(
  source: HTMLImageElement | HTMLVideoElement
): HueBucket[] | null {
  try {
    const size = 48;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(source, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    const buckets: HueBucket[] = Array.from({ length: 36 }, () => ({
      weight: 0,
      h: 0,
      s: 0,
      l: 0,
    }));

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 200) continue;
      const { h, s, l } = rgbToHsl(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
      if (l < 0.1 || l > 0.9 || s < 0.15) continue;
      const weight = s * (1 - Math.abs(l - 0.5) * 1.3);
      if (weight <= 0) continue;
      const bucket = buckets[Math.floor(h / 10) % 36];
      bucket.weight += weight;
      bucket.h += h * weight;
      bucket.s += s * weight;
      bucket.l += l * weight;
    }

    return buckets;
  } catch {
    return null;
  }
}

/**
 * Samples an already-loaded <img> or <video> frame on an offscreen canvas and
 * returns the dominant *vivid* hue — weighted toward saturated, mid-lightness
 * pixels so a bright subject wins over dark shadows or blown-out sky/highlights.
 */
export function extractDominantAccent(
  source: HTMLImageElement | HTMLVideoElement
): AccentPair | null {
  const buckets = sampleHueBuckets(source);
  if (!buckets) return null;

  const best = buckets.reduce((a, b) => (b.weight > a.weight ? b : a));
  if (best.weight === 0) return null;

  return buildAccentPair(best.h / best.weight, best.s / best.weight);
}

/** Shortest distance between two hues on the 360° wheel. */
function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * Multi-color palette sampled from the media's own pixels — the top `count`
 * vivid hue families, preferring hues at least 25° apart so the stops read as
 * distinct colors. Unlike paletteFromAccent (which synthesizes hue shifts from
 * a single accent), these colors genuinely occur in the wallpaper, so UI
 * gradients built from them blend seamlessly with it.
 */
export function extractDominantPalette(
  source: HTMLImageElement | HTMLVideoElement,
  count = 3
): string[] | null {
  const buckets = sampleHueBuckets(source);
  if (!buckets) return null;

  const sorted = buckets
    .filter((b) => b.weight > 0)
    .sort((a, b) => b.weight - a.weight);
  if (sorted.length === 0) return null;

  const MIN_HUE_SEPARATION = 25;
  const picked: HueBucket[] = [];
  for (const bucket of sorted) {
    if (picked.length >= count) break;
    const h = bucket.h / bucket.weight;
    if (picked.every((p) => hueDistance(p.h / p.weight, h) >= MIN_HUE_SEPARATION)) {
      picked.push(bucket);
    }
  }
  // Not enough well-separated families — top up with the next strongest buckets.
  for (const bucket of sorted) {
    if (picked.length >= count) break;
    if (!picked.includes(bucket)) picked.push(bucket);
  }

  return picked.map((b) =>
    hslToHex(
      b.h / b.weight,
      clamp(b.s / b.weight, 0.4, 0.85),
      clamp(b.l / b.weight, 0.45, 0.68)
    )
  );
}

/** Accent pair derived from a gradient wallpaper's declared color stops. */
export function accentFromGradientColors(colors: string[]): AccentPair | null {
  for (const color of colors) {
    const hsl = parseColorToHsl(color);
    if (hsl && hsl.s > 0.1) return buildAccentPair(hsl.h, hsl.s);
  }
  return null;
}

/**
 * Three-stop gradient palette built from the current accent's hue, for UI
 * elements (shader washes, decorative gradients) that need an analogous
 * color set rather than a single flat color. Mirrors the shape of the
 * hand-picked triads it replaces: a saturated base, a lighter shifted-hue
 * mid tone, and a soft near-white highlight.
 */
export function paletteFromAccent(accent: string): string[] {
  const hsl = parseColorToHsl(accent);
  if (!hsl) return [accent, accent, accent];

  const { h, s } = hsl;
  return [
    hslToHex(h, clamp(s, 0.45, 0.85), 0.5),
    hslToHex((h + 25) % 360, clamp(s * 0.75, 0.3, 0.7), 0.62),
    hslToHex((h - 20 + 360) % 360, clamp(s * 0.4, 0.15, 0.5), 0.82),
  ];
}
