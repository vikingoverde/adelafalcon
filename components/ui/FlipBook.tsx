"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type TransitionEvent } from "react";
import type { ResolvedMediaItem } from "@/lib/projects";
import { pad2 } from "@/lib/site";

type Props = { pages: ResolvedMediaItem[]; title: string };

/** One page: an image, or a blank numbered sheet for pages still to come. */
function Page({ item, n, sizes }: { item: ResolvedMediaItem | undefined; n: number; sizes: string }) {
  if (!item) return <div className="h-full w-full" />;
  if (item.kind === "image")
    return (
      <div className="relative h-full w-full bg-paper-deep">
        <Image
          src={item.image.src}
          alt={item.alt}
          fill
          sizes={sizes}
          placeholder={item.image.blurDataURL ? "blur" : "empty"}
          blurDataURL={item.image.blurDataURL}
          className="object-cover"
        />
      </div>
    );
  return (
    <div className="flex h-full w-full items-end justify-between bg-white p-3 text-micro uppercase md:p-4">
      <span>({pad2(n)})</span>
      <span>{item.kind === "placeholder" ? "Page to come" : item.alt}</span>
    </div>
  );
}

/**
 * A book you can leaf through. Desktop: two-page spreads; the page turns over the spine in
 * 3D (buttons, ← → keys, or click a page). The first page is the cover, alone on the right.
 * Phones: a swipeable one-page-at-a-time slider. Reduced motion: pages change without turning.
 */
export function FlipBook({ pages, title }: Props) {
  const total = pages.length;
  const spreads = Math.floor(total / 2) + 1;
  const [spread, setSpread] = useState(0);
  const [flip, setFlip] = useState<null | { dir: "next" | "prev"; turned: boolean }>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Spread k shows page 2k-1 on the left and 2k on the right (0-based); spread 0 is the cover alone.
  const left = (k: number) => pages[2 * k - 1];
  const right = (k: number) => pages[2 * k];

  const go = useCallback(
    (dir: "next" | "prev") => {
      if (flip) return;
      if (dir === "next" && spread >= spreads - 1) return;
      if (dir === "prev" && spread <= 0) return;
      if (reduce.current) {
        setSpread((s) => s + (dir === "next" ? 1 : -1));
        return;
      }
      setFlip({ dir, turned: false });
      // Next frame: start the CSS transition.
      requestAnimationFrame(() => requestAnimationFrame(() => setFlip({ dir, turned: true })));
    },
    [flip, spread, spreads],
  );

  const onFlipEnd = (e: TransitionEvent) => {
    if (e.propertyName !== "transform" || !flip) return;
    setSpread((s) => s + (flip.dir === "next" ? 1 : -1));
    setFlip(null);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go("next");
    if (e.key === "ArrowLeft") go("prev");
  };

  // What sits underneath while a leaf is turning.
  const underLeft = flip?.dir === "prev" ? left(spread - 1) : left(spread);
  const underRight = flip?.dir === "next" ? right(spread + 1) : right(spread);
  const first = 2 * spread - 1 + 1; // 1-based number of the left page
  const counter =
    spread === 0 ? `${pad2(1)} / ${pad2(total)}` : `${pad2(first)}${right(spread) ? `–${pad2(first + 1)}` : ""} / ${pad2(total)}`;
  const sizes = "(min-width: 768px) 34vw, 80vw";

  return (
    <div>
      {/* Desktop flip-book */}
      <div
        role="group"
        aria-roledescription="book"
        aria-label={`${title} — pages ${counter}. Use the arrow keys to turn pages.`}
        tabIndex={0}
        onKeyDown={onKey}
        className="hidden md:block"
      >
        <div className="relative mx-auto aspect-[2/1] w-full [perspective:2400px]">
          {/* Left page */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => go("prev")}
            className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize shadow-[inset_-18px_0_24px_-20px_rgba(0,0,0,0.35)]"
          >
            <Page item={underLeft} n={2 * (flip?.dir === "prev" ? spread - 1 : spread)} sizes={sizes} />
          </button>
          {/* Right page */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => go("next")}
            className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize shadow-[inset_18px_0_24px_-20px_rgba(0,0,0,0.35)]"
          >
            <Page item={underRight} n={2 * (flip?.dir === "next" ? spread + 1 : spread) + 1} sizes={sizes} />
          </button>

          {/* The turning leaf */}
          {flip && (
            <div
              onTransitionEnd={onFlipEnd}
              className={`absolute inset-y-0 w-1/2 [transform-style:preserve-3d] transition-transform duration-700 ease-[cubic-bezier(0.45,0.05,0.25,1)] ${
                flip.dir === "next" ? "right-0 origin-left" : "left-0 origin-right"
              }`}
              style={{ transform: flip.turned ? `rotateY(${flip.dir === "next" ? -180 : 180}deg)` : "rotateY(0deg)" }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <Page
                  item={flip.dir === "next" ? right(spread) : left(spread)}
                  n={flip.dir === "next" ? 2 * spread + 1 : 2 * spread}
                  sizes={sizes}
                />
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <Page
                  item={flip.dir === "next" ? left(spread + 1) : right(spread - 1)}
                  n={flip.dir === "next" ? 2 * spread + 2 : 2 * spread - 1}
                  sizes={sizes}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-3 items-baseline text-micro uppercase">
          <button type="button" onClick={() => go("prev")} disabled={spread === 0} className="justify-self-start hover:underline disabled:opacity-40">
            (Previous)
          </button>
          <p aria-live="polite" className="justify-self-center">
            Pages {counter}
          </p>
          <button
            type="button"
            onClick={() => go("next")}
            disabled={spread >= spreads - 1}
            className="justify-self-end hover:underline disabled:opacity-40"
          >
            (Next)
          </button>
        </div>
      </div>

      {/* Phone slider */}
      <ul
        tabIndex={0}
        aria-label={`${title} — ${total} pages, swipe sideways`}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:hidden"
      >
        {pages.map((p, i) => (
          <li key={i} className="aspect-square w-[80vw] shrink-0 snap-center shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
            <Page item={p} n={i + 1} sizes="80vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}
