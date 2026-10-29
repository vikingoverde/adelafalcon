"use client";

import { useRef, type CSSProperties } from "react";
import { useInViewOnce, useScreenStroke } from "@/lib/hooks";
import { drawings, type Drawing, type LineArtName } from "./line-art/drawings";

// Drawn with currentColor, so the palette lives in tailwind.config.ts.
const colors = { accent: "text-accent", ink: "text-ink-soft", marker: "text-marker" } as const;

type Props = {
  name: LineArtName;
  color?: keyof typeof colors;
  /** Stroke width in screen pixels; kept constant whatever size the drawing renders at. */
  strokeWidth?: number;
  className?: string;
  /** Seconds for the full drawing. */
  duration?: number;
  delay?: number;
  /** Redraw whenever an ancestor with the `group` class is hovered or focused (work index). */
  redrawOnHover?: boolean;
  /** Decorative by default. Pass true to expose the drawing's label to screen readers. */
  meaningful?: boolean;
};

/**
 * Large, thin single-colour illustration meant to overlap photos and text. Strokes draw in
 * sequence when scrolled into view; filled shapes (brush stripes) fade in as their turn comes. The animation is pure CSS (see `.draw` in globals.css),
 * and is skipped entirely under prefers-reduced-motion.
 */
export function LineArt({
  name,
  color = "accent",
  strokeWidth = 1.75,
  className = "",
  duration = 2.2,
  delay = 0,
  redrawOnHover = false,
  meaningful = false,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const drawn = useInViewOnce(ref);
  const art: Drawing = drawings[name];
  const vbWidth = Number(art.viewBox.split(" ")[2]);
  const stroke = useScreenStroke(ref, strokeWidth, vbWidth) ?? strokeWidth * (vbWidth / 400);
  const step = duration / art.strokes.length;

  return (
    <svg
      ref={ref}
      viewBox={art.viewBox}
      fill="none"
      data-drawn={drawn}
      className={`draw pointer-events-none overflow-visible ${colors[color]} ${redrawOnHover ? "draw-redraw" : ""} ${className}`}
      style={{ "--draw-step": `${step}s`, "--draw-delay": `${delay}s`, "--draw-dur": `${Math.max(step * 2.2, 0.35)}s` } as CSSProperties}
      role={meaningful ? "img" : undefined}
      aria-label={meaningful ? art.label : undefined}
      aria-hidden={meaningful ? undefined : true}
      focusable="false"
    >
      {art.strokes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          transform={s.transform}
          pathLength={1}
          data-fill={s.fill || undefined}
          fill={s.fill ? "currentColor" : undefined}
          stroke={s.fill ? undefined : "currentColor"}
          strokeWidth={s.fill ? undefined : stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </svg>
  );
}
