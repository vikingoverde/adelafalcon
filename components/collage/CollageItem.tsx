"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { createContext, useContext, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useMediaQuery } from "@/lib/hooks";
import { ease, stagger } from "@/lib/motion";
import { seededRange } from "@/lib/seeded";

const ClusterContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

/**
 * A board that collage items can be dragged around on. On md+ items are absolutely
 * positioned inside it; on mobile they stack in a single column.
 */
export function CollageBoard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <ClusterContext.Provider value={ref}>
      <div ref={ref} className={`relative flex flex-col gap-10 md:block ${className}`}>
        {children}
      </div>
    </ClusterContext.Provider>
  );
}

type Props = {
  children: ReactNode;
  /** Order of placement (stagger) and a seed for the entry wobble. */
  index: number;
  /** Desktop position + width inside the board, as CSS lengths (e.g. "12%"). */
  x?: string;
  y?: string;
  w?: string;
  z?: number;
  /** Parallax travel in px across the viewport (positive = moves up faster). 0 disables. */
  depth?: number;
  draggable?: boolean;
  /** Above-the-fold items skip the fade so they paint immediately (better LCP). */
  eager?: boolean;
  /** Mobile stacking: alignment and width. */
  align?: "start" | "center" | "end";
  mobileWidth?: string;
  className?: string;
};

const alignClass = { start: "self-start", center: "self-center", end: "self-end" };

export function CollageItem({
  children,
  index,
  x = "0%",
  y = "0%",
  w = "30%",
  z = 1,
  depth = 0,
  draggable = false,
  eager = false,
  align = "center",
  mobileWidth = "78%",
  className = "",
}: Props) {
  const board = useContext(ClusterContext);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 768px) and (pointer: fine)");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [depth, -depth]);

  const wobble = seededRange(`wobble-${index}`, -7, 7);
  const canDrag = draggable && desktop && !reduce;

  const style = {
    "--x": x,
    "--y": y,
    "--w": w,
    "--mw": mobileWidth,
    zIndex: z,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      style={style}
      className={`relative w-[var(--mw)] md:absolute md:left-[var(--x)] md:top-[var(--y)] md:w-[var(--w)] ${alignClass[align]} ${className}`}
    >
      <m.div style={{ y: reduce || !depth ? 0 : parallaxY }}>
        <m.div
          initial={{ opacity: eager ? 1 : 0, y: -18, rotate: wobble, scale: 1.05 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.7, delay: stagger(index, 0.09), ease: ease.settle }}
          drag={canDrag}
          dragConstraints={board ?? undefined}
          dragElastic={0.18}
          dragSnapToOrigin
          dragTransition={{ bounceStiffness: 320, bounceDamping: 18 }}
          whileDrag={{ scale: 1.04, zIndex: 50, cursor: "grabbing" }}
          className={canDrag ? "cursor-grab touch-none" : undefined}
        >
          {children}
        </m.div>
      </m.div>
    </div>
  );
}
