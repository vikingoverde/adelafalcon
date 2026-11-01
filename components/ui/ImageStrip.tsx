import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { ImageData } from "@/lib/images";
import { pad2 } from "@/lib/site";
import { WheelScroll } from "./WheelScroll";

export type StripItem = {
  href: string;
  image: ImageData;
  alt: string;
  title: string;
  detail: string;
};

/**
 * Builds two clip-path polygons with the same number of points: a flat rectangle and a
 * "pincushion" whose edges sag inward, like a print warping as it is picked up. Because
 * the point counts match, CSS can animate between them.
 */
function polygons(sag = 0.035, steps = 12) {
  const flat: string[] = [];
  const warp: string[] = [];
  const add = (x: number, y: number, wx: number, wy: number) => {
    flat.push(`${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`);
    warp.push(`${(wx * 100).toFixed(2)}% ${(wy * 100).toFixed(2)}%`);
  };
  const s = (t: number) => Math.sin(Math.PI * t) * sag;
  for (let i = 0; i <= steps; i++) add(i / steps, 0, i / steps, s(i / steps)); // top
  for (let i = 1; i <= steps; i++) add(1, i / steps, 1 - s(i / steps) * 0.6, i / steps); // right
  for (let i = steps - 1; i >= 0; i--) add(i / steps, 1, i / steps, 1 - s(i / steps) * 1.2); // bottom
  for (let i = steps - 1; i >= 1; i--) add(0, i / steps, s(i / steps) * 0.6, i / steps); // left
  return { flat: `polygon(${flat.join(",")})`, warp: `polygon(${warp.join(",")})` };
}
const { flat, warp } = polygons();

/**
 * The home page reel: a horizontal row of black & white prints. On desktop the hovered
 * (or keyboard-focused) print grows, warps slightly, turns to colour and shows its caption;
 * when nothing is hovered, `activeIndex` is the one shown large. On mobile it is a simple
 * swipeable row with captions underneath. All of this is CSS (see `.strip` in globals.css).
 */
export function ImageStrip({ items, activeIndex = 1, label }: { items: StripItem[]; activeIndex?: number; label: string }) {
  return (
    <WheelScroll className="no-scrollbar strip-mask w-full overflow-x-auto overscroll-x-contain">
      <ul
        aria-label={label}
        className="strip flex w-max items-center px-[6vw] md:px-[10vw] md:py-16"
        style={{ "--flat": flat, "--warp": warp } as CSSProperties}
      >
        {items.map((item, i) => (
          <li key={item.href + item.image.src + i} className="strip-item" data-default={i === activeIndex || undefined}>
            <Link href={item.href} className="strip-link block px-[0.35vw] md:px-[0.3vw]">
              <span className="strip-caption block text-micro uppercase">
                <span className="block">({pad2(i + 1)})</span>
                <span className="block">
                  {item.title} — {item.detail}
                </span>
              </span>
              <span className="strip-frame relative block aspect-[3/4] overflow-hidden bg-paper-deep">
                <Image
                  src={item.image.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 20vw, 62vw"
                  priority={i < 4}
                  placeholder={item.image.blurDataURL ? "blur" : "empty"}
                  blurDataURL={item.image.blurDataURL}
                  className="strip-img object-cover"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </WheelScroll>
  );
}
