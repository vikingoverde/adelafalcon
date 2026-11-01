"use client";

import { m } from "framer-motion";
import { ease, stagger } from "@/lib/motion";

/** The small vertical list of brand adjectives, in small red type, as in the editorial reference. */
export function AdjectiveList({ words, className = "" }: { words: readonly string[]; className?: string }) {
  return (
    <div className={className}>
      <h2 className="sr-only">In a few words</h2>
      <ul className="flex flex-col font-label text-[0.8125rem] font-medium lowercase leading-[1.3] text-accent-ink md:text-sm">
        {words.map((w, i) => (
          <m.li
            key={w}
            initial={{ x: -6 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, delay: stagger(i, 0.05, 0.3), ease: ease.settle }}
          >
            {w}
            {i < words.length - 1 ? <span className="sr-only">,</span> : null}
          </m.li>
        ))}
      </ul>
    </div>
  );
}
