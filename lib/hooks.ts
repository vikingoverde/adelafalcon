"use client";

import { useEffect, useState, type RefObject } from "react";

/** SSR-safe media query hook. Returns `false` until mounted. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/**
 * Sets `data-drawn="true"` on the element once it scrolls into view; CSS in globals.css
 * turns that into a stroke draw-in. No animation frames run in JS.
 */
export function useInViewOnce<T extends Element>(ref: RefObject<T | null>, rootMargin = "0px 0px -12% 0px") {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, seen]);
  return seen;
}

/**
 * Converts a stroke width in screen pixels into viewBox units for an SVG, so line art stays
 * equally thin at any rendered size (vector-effect: non-scaling-stroke can't be combined with
 * pathLength-based draw animations).
 */
export function useScreenStroke(ref: RefObject<SVGSVGElement | null>, px: number, viewBoxWidth: number) {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry?.contentRect.width;
      if (w) setWidth((px * viewBoxWidth) / w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, px, viewBoxWidth]);
  return width;
}
