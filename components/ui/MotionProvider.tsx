"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Feature bundle (incl. drag) is code-split and loaded after first paint.
const loadFeatures = () => import("./motion-features").then((m) => m.default);

/**
 * `reducedMotion="user"` makes Framer Motion skip transform/layout animations for
 * people who ask for reduced motion; components also check `useReducedMotion()`
 * to switch off drag, parallax and line draw-ins entirely.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
