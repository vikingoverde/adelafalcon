import type { ReactNode } from "react";
import { hash, seededRange } from "@/lib/seeded";

export type TornEdge = "top" | "right" | "bottom" | "left";

type Props = {
  children: ReactNode;
  edges?: TornEdge[];
  seed?: string;
  /** Depth of the tear as a fraction of the box (0.01–0.06 looks natural). */
  depth?: number;
  className?: string;
};

/**
 * Builds a jagged SVG clip-path in objectBoundingBox units (0–1), so it scales
 * to any element. Shadow is applied with `drop-shadow` on a wrapper because
 * clip-path would cut off a regular box-shadow.
 */
function tornPath(edges: TornEdge[], seed: string, depth: number) {
  const steps = 28;
  const pts: [number, number][] = [];
  const j = (k: string) => seededRange(`${seed}-${k}`, 0, depth);
  const has = (e: TornEdge) => edges.includes(e);

  for (let i = 0; i <= steps; i++) pts.push([i / steps, has("top") ? j(`t${i}`) : 0]);
  for (let i = 1; i <= steps; i++) pts.push([has("right") ? 1 - j(`r${i}`) : 1, i / steps]);
  for (let i = steps - 1; i >= 0; i--) pts.push([i / steps, has("bottom") ? 1 - j(`b${i}`) : 1]);
  for (let i = steps - 1; i >= 1; i--) pts.push([has("left") ? j(`l${i}`) : 0, i / steps]);

  return "M" + pts.map(([x, y]) => `${x.toFixed(4)} ${y.toFixed(4)}`).join(" L") + " Z";
}

export function TornPaper({ children, edges = ["bottom"], seed = "torn", depth = 0.035, className = "" }: Props) {
  const id = `torn-${hash(seed + edges.join(""))}`;
  return (
    <div className={`relative [filter:drop-shadow(0_6px_10px_rgba(30,30,28,0.18))] ${className}`}>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={tornPath(edges, seed, depth)} />
          </clipPath>
        </defs>
      </svg>
      <div style={{ clipPath: `url(#${id})` }}>{children}</div>
    </div>
  );
}
