"use client";

import { m, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { ease } from "@/lib/motion";

// The very first render (server + hydration) skips the wipe so content paints immediately.
let firstLoad = true;

/** Page transition: a sheet of paper slides across and off the page on every navigation. */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const animate = !firstLoad && !reduce;

  useEffect(() => {
    firstLoad = false;
    if (animate) window.scrollTo(0, 0);
  }, [animate]);

  return (
    <>
      {animate && (
        <m.div
          aria-hidden="true"
          className="paper-wipe pointer-events-none fixed inset-y-0 left-0 z-[60] w-[120vw] bg-paper-deep"
          initial={{ x: "-8vw" }}
          animate={{ x: "110vw" }}
          transition={{ duration: 0.75, ease: ease.wipe }}
        />
      )}
      <m.div
        initial={animate ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18, ease: ease.settle }}
      >
        {children}
      </m.div>
    </>
  );
}
