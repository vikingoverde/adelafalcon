"use client";

import { m } from "framer-motion";
import { ease, stagger } from "@/lib/motion";

/** The small vertical list of brand adjectives, each on a strip of highlighter green. */
export function AdjectiveList({ words, className = "" }: { words: readonly string[]; className?: string }) {
  return (
    <div className={className}>
      <h2 className="sr-only">In a few words</h2>
      <ul className="flex flex-col items-start gap-[3px] font-label text-[0.8125rem] font-medium lowercase leading-[1.3] md:text-sm">
        {words.map((w, i) => (
          <m.li
            key={w}
            initial={{ x: -6 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, delay: stagger(i, 0.05, 0.3), ease: ease.settle }}
          >
            <span className="box-decoration-clone bg-accent px-1 text-ink">{w}</span>
            {i < words.length - 1 ? <span className="sr-only">,</span> : null}
          </m.li>
        ))}
      </ul>
    </div>
  );
}
