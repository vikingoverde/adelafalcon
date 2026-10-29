"use client";

import { useRef, type CSSProperties } from "react";
import { useInViewOnce, useScreenStroke } from "@/lib/hooks";

/** Hand-drawn marker strokes. Each variant is one or more paths in its own viewBox. */
const variants = {
  underline: { viewBox: "0 0 300 24", paths: ["M4 14 C 60 6 120 18 180 10 C 220 5 260 8 296 12", "M30 20 C 100 14 190 18 260 16"] },
  circle: {
    viewBox: "0 0 200 120",
    paths: ["M150 18 C 120 4 50 6 22 34 C -2 60 20 104 92 110 C 160 116 196 84 186 52 C 178 24 130 10 84 14"],
  },
  arrow: { viewBox: "0 0 140 80", paths: ["M6 70 C 30 30 70 14 128 18", "M108 6 L 130 18 L 112 34"] },
  zigzag: { viewBox: "0 0 200 30", paths: ["M4 22 L 24 8 L 44 22 L 64 8 L 84 22 L 104 8 L 124 22 L 144 8 L 164 22 L 184 8 L 196 16"] },
  star: { viewBox: "0 0 100 100", paths: ["M50 6 L 60 38 L 94 38 L 66 58 L 78 92 L 50 70 L 22 92 L 34 58 L 6 38 L 40 38 Z"] },
  heart: { viewBox: "0 0 100 90", paths: ["M50 84 C 10 56 2 30 18 14 C 32 2 48 10 50 26 C 52 10 68 2 82 14 C 98 30 90 56 50 84"] },
  cross: { viewBox: "0 0 60 60", paths: ["M8 10 C 24 26 38 40 52 52", "M50 8 C 36 24 22 38 10 54"] },
} as const;

export type ScribbleVariant = keyof typeof variants;

// Drawn with currentColor, so the palette lives in tailwind.config.ts.
const colors = { marker: "text-marker", accent: "text-accent", ink: "text-ink", markerInk: "text-marker-ink" } as const;

type Props = {
  variant?: ScribbleVariant;
  color?: keyof typeof colors;
  /** Stroke width in screen pixels. */
  strokeWidth?: number;
  className?: string;
  /** "view": draw when scrolled into view. "manual": draw while `active` is true (e.g. on hover). */
  trigger?: "view" | "manual";
  active?: boolean;
  delay?: number;
  duration?: number;
};

/** Marker scribbles that draw themselves in (pure CSS, see `.draw` in globals.css). */
export function Scribble({
  variant = "underline",
  color = "marker",
  strokeWidth = 3,
  className = "",
  trigger = "view",
  active = false,
  delay = 0,
  duration = 0.9,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInViewOnce(ref);
  const v = variants[variant];
  const vbWidth = Number(v.viewBox.split(" ")[2]);
  // preserveAspectRatio="none" stretches the art, so convert using the rendered width.
  const stroke = useScreenStroke(ref, strokeWidth, vbWidth) ?? strokeWidth;
  const drawn = trigger === "view" ? seen : active;

  return (
    <svg
      ref={ref}
      viewBox={v.viewBox}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-drawn={drawn}
      data-trigger={trigger}
      className={`draw pointer-events-none overflow-visible ${colors[color]} ${className}`}
      style={{ "--draw-step": `${duration * 0.6}s`, "--draw-delay": `${delay}s`, "--draw-dur": `${duration}s` } as CSSProperties}
    >
      {v.paths.map((d, i) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </svg>
  );
}
