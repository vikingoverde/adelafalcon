import type { CSSProperties } from "react";
import { seededRange } from "@/lib/seeded";

export const tapeColors = {
  blush: "rgba(244, 198, 207, 0.72)",
  butter: "rgba(246, 231, 168, 0.75)",
  sky: "rgba(201, 221, 240, 0.72)",
  mint: "rgba(207, 232, 213, 0.75)",
  lilac: "rgba(220, 207, 234, 0.72)",
  accent: "rgba(138, 206, 0, 0.5)",
  kraft: "rgba(214, 196, 166, 0.7)",
} as const;

export type TapeColor = keyof typeof tapeColors;
export type TapePosition = "tl" | "tr" | "bl" | "br" | "top" | "bottom";

const placement: Record<TapePosition, { className: string; angle: number }> = {
  tl: { className: "-left-5 -top-2", angle: -38 },
  tr: { className: "-right-5 -top-2", angle: 38 },
  bl: { className: "-bottom-2 -left-5", angle: 38 },
  br: { className: "-bottom-2 -right-5", angle: -38 },
  top: { className: "-top-3 left-1/2 -ml-12 md:-ml-14", angle: -3 },
  bottom: { className: "-bottom-3 left-1/2 -ml-12 md:-ml-14", angle: 4 },
};

// Torn, slightly zig-zagged short ends.
const TORN_ENDS =
  "polygon(2% 0%, 98% 0%, 100% 18%, 97% 35%, 100% 52%, 97% 70%, 100% 86%, 98% 100%, 2% 100%, 0% 84%, 3% 66%, 0% 50%, 3% 33%, 0% 16%)";

type Props = {
  position?: TapePosition;
  color?: TapeColor;
  seed?: string;
  className?: string;
};

/** A strip of semi-transparent washi tape. Place inside a `relative` parent. */
export function TapeStrip({ position = "top", color = "butter", seed = "tape", className = "" }: Props) {
  const { className: pos, angle } = placement[position];
  const jitter = seededRange(seed + position, -6, 6);
  const style: CSSProperties = {
    background: `linear-gradient(90deg, rgba(255,255,255,0.18), transparent 30%, rgba(255,255,255,0.12) 70%, transparent), ${tapeColors[color]}`,
    clipPath: TORN_ENDS,
    transform: `rotate(${angle + jitter}deg)`,
  };
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 block h-6 w-24 mix-blend-multiply md:h-7 md:w-28 ${pos} ${className}`}
      style={style}
    />
  );
}
