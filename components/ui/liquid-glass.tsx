import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Liquid Glass primitives — web port of the iOS/macOS 26
 * `liquid-glass-design` skill (see SKILL.md):
 *
 *   SwiftUI                                                      Here
 *   ─────────────────────────────────────────────────────────   ─────────────────────────────
 *   `.glassEffect()`                                  →         `glassEffect()`
 *   `.glassEffect(.regular.tint(c).interactive(), …)` →         `glassEffect({ interactive: true })`
 *                                                               + `glassTintStyle(c)`
 *   shape `.capsule` (default) / `.rect(r)` / `.circle` →       `shape: "capsule" | "rect" | "circle" | "none"`
 *   `GlassEffectContainer(spacing:)`                  →         `<GlassEffectContainer spacing={}>`
 *   `@Namespace` + `.glassEffectID(_:in:)` morphing   →         `<LayoutGroup>` + motion `layoutId`
 *                                                               (`LG_MORPH_SPRING` = `withAnimation` default)
 *   `.buttonStyle(.glass)` / `.glassProminent`        →         Button variants "glass" / "glassProminent"
 *
 * Best practices carried over from the skill:
 *  - Apply `glassEffect()` AFTER other appearance/layout classes: `cn("p-2 …", glassEffect())`.
 *  - Only pass `interactive: true` to elements that respond to interaction.
 *  - Wrap sibling glass elements in ONE `GlassEffectContainer`.
 *  - Never put opaque backgrounds behind glass — it defeats the translucency.
 *  - Reserve glass for interactive elements, toolbars, and cards.
 */

/** `withAnimation` default for glass morphing transitions (LayoutGroup + layoutId). */
export const LG_MORPH_SPRING = {
  type: "spring",
  stiffness: 480,
  damping: 36,
  mass: 0.9,
} as const;

const glassVariants = cva("lg-glass", {
  variants: {
    shape: {
      /** Default per the skill: capsule. */
      capsule: "rounded-full",
      /** `.rect(cornerRadius:)` — corner size comes from `--lg-radius` (glassRadiusStyle). */
      rect: "lg-radius-rect",
      circle: "rounded-full aspect-square",
      /** Material only — the element keeps its own corner radius classes. */
      none: "",
    },
    interactive: {
      true: "lg-glass-interactive",
      false: "",
    },
  },
  defaultVariants: { shape: "capsule", interactive: false },
});

export type GlassShape = "capsule" | "rect" | "circle" | "none";

export interface GlassEffectOptions {
  /** `.capsule` (default) | `.rect(cornerRadius:)` | `.circle` | "none" (caller owns the radius). */
  shape?: GlassShape;
  /** `.interactive()` — opt-in touch/pointer reactions. */
  interactive?: boolean;
}

/**
 * `.glassEffect(_:in:)` — the Liquid Glass modifier. Returns class names, so it
 * can be applied to ANY element (motion.div, button, aside…) after its other
 * appearance classes:
 *
 *   <div className={cn("flex rounded-[20px] p-3", glassEffect({ shape: "none" }))} />
 */
export function glassEffect(options: GlassEffectOptions = {}): string {
  const { shape, interactive } = options;
  return glassVariants({ shape, interactive });
}

/** `.tint(color)` — per-element tint hook consumed by the `.lg-glass` material. */
export function glassTintStyle(tint: string): React.CSSProperties {
  return { "--lg-tint": tint } as React.CSSProperties;
}

/** `.rect(cornerRadius:)` — corner size hook for the "rect" shape. */
export function glassRadiusStyle(radius: number): React.CSSProperties {
  return { "--lg-radius": `${radius}px` } as React.CSSProperties;
}

export interface GlassEffectProps
  extends React.HTMLAttributes<HTMLDivElement>,
    GlassEffectOptions {
  /** `.tint(color)` */
  tint?: string;
  /** `.rect(cornerRadius:)` corner size (only for shape="rect"). */
  cornerRadius?: number;
}

/**
 * Convenience glass surface. The default is exactly the skill's default:
 * regular variant, capsule shape, non-interactive.
 *
 *   <GlassEffect>Hello</GlassEffect>
 *   <GlassEffect tint="#0a84ff" interactive shape="rect" cornerRadius={16}>…</GlassEffect>
 */
export const GlassEffect = ({
  shape,
  interactive,
  tint,
  cornerRadius,
  className,
  style,
  ...props
}: GlassEffectProps) => (
  <div
    className={cn(glassEffect({ shape, interactive }), className)}
    style={{
      ...style,
      ...(tint ? glassTintStyle(tint) : null),
      ...(cornerRadius ? glassRadiusStyle(cornerRadius) : null),
    }}
    {...props}
  />
);

export interface GlassEffectContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Merge distance for sibling glass (SwiftUI `spacing:`) — exposed to the
   * group's glass as `--lg-spacing`. Closer elements blend; larger values let
   * distant elements join.
   */
  spacing?: number;
}

/**
 * `GlassEffectContainer(spacing:)` — ALWAYS wrap groups of sibling glass
 * elements in one container (skill rule). Gives the group its own paint
 * context so backdrops render as one material and can morph together.
 */
export const GlassEffectContainer = ({
  spacing = 20,
  className,
  style,
  ...props
}: GlassEffectContainerProps) => (
  <div
    className={cn("lg-glass-container", className)}
    style={{ ...style, "--lg-spacing": `${spacing}px` } as React.CSSProperties}
    {...props}
  />
);
