"use client";

import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";

/**
 * A small accent dot that follows the pointer and turns into a "view" label over
 * anything marked with `data-cursor="view"` (or any `data-cursor="<text>"`).
 * Only on devices with a fine pointer; the native cursor is kept elsewhere.
 */
export function Cursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState<string | null>(null);
  const [overLink, setOverLink] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      const target = t?.closest?.("[data-cursor]");
      setLabel(target?.getAttribute("data-cursor") ?? null);
      setOverLink(Boolean(t?.closest?.("a, button, [role=button]")));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80]"
      style={{ x: reduce ? x : sx, y: reduce ? y : sy, opacity: visible ? 1 : 0 }}
    >
      <m.div
        className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-accent"
        animate={{
          width: label ? 68 : overLink ? 22 : 12,
          height: label ? 68 : overLink ? 22 : 12,
          opacity: overLink && !label ? 0.7 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        <AnimatePresence>
          {label && (
            <m.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-label text-label-sm font-semibold uppercase text-ink"
            >
              {label}
            </m.span>
          )}
        </AnimatePresence>
      </m.div>
    </m.div>
  );
}
