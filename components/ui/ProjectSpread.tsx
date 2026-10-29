import Link from "next/link";
import type { CSSProperties } from "react";
import { LineArt } from "@/components/collage/LineArt";
import { Note } from "@/components/collage/Note";
import { Polaroid } from "@/components/collage/Polaroid";
import { Scribble } from "@/components/collage/Scribble";
import { SwatchRow } from "@/components/collage/Swatch";
import { TapedPhoto } from "@/components/collage/TapedPhoto";
import type { TapeColor } from "@/components/collage/TapeStrip";
import type { ProjectCard } from "@/lib/projects";
import { formatCounter } from "@/lib/site";
import { Label } from "./Label";

type Props = { project: ProjectCard; index: number; total: number };

// Resting position of each small polaroid around the cover (desktop), and how far it slides on hover.
const slots = [
  { className: "md:-right-[6%] md:top-[6%]", spread: ["26px", "-14px", "4deg"], tape: "blush" },
  { className: "md:-bottom-[10%] md:right-[18%]", spread: ["16px", "26px", "-5deg"], tape: "mint" },
  { className: "md:-bottom-[4%] md:-left-[3%]", spread: ["-26px", "18px", "-3deg"], tape: "butter" },
] as const;

// Hover/focus "spread out" is pure CSS so the whole card stays a server component.
const spreadOnHover =
  "transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] md:group-hover:[transform:translate(var(--sx),var(--sy))_rotate(var(--sr))] md:group-focus-within:[transform:translate(var(--sx),var(--sy))_rotate(var(--sr))]";

/** One project on the work index, laid out as a moodboard spread. Hover or focus spreads the prints out. */
export function ProjectSpread({ project: p, index, total }: Props) {
  const flip = index % 2 === 1;
  const href = `/work/${p.slug}`;
  const titleId = `project-${p.slug}`;

  return (
    <article
      aria-labelledby={titleId}
      data-cursor="view"
      className="group sheet-cols relative scroll-mt-24 gap-y-10 rounded-sm py-16 outline-offset-8 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-accent-ink md:py-24"
    >
      <Label className="col-span-2 md:col-span-6">project mood</Label>
      <Label className="col-span-2 text-right md:col-span-6">
        <span aria-hidden="true">{formatCounter(index + 1, total)}</span>
        <span className="sr-only">
          project {index + 1} of {total}
        </span>
      </Label>

      {/* Image cluster */}
      <div
        className={`relative col-span-4 md:col-span-7 md:row-start-2 ${flip ? "md:col-start-6" : "md:col-start-1"}`}
      >
        <div
          className={`relative transition-transform duration-500 ease-out md:w-[78%] ${
            flip ? "group-hover:rotate-1" : "group-hover:-rotate-1"
          } group-hover:scale-[1.01]`}
        >
          <TapedPhoto
            image={p.coverImage}
            alt={p.coverAlt}
            seed={`${p.slug}-cover`}
            tape={[{ position: "top", color: flip ? "sky" : "butter" }]}
            aspectClassName="aspect-[4/3]"
            sizes="(min-width: 768px) 42vw, 92vw"
            priority={index === 0}
          />
        </div>

        <div className="relative z-10 -mt-10 flex justify-end gap-3 pr-2 md:static md:mt-0 md:block">
          {p.galleryImages.map((img, i) => {
            const slot = slots[i % slots.length]!;
            return (
              <div
                key={img.src + i}
                className={`w-[44%] md:absolute md:w-[26%] ${i > 1 ? "hidden md:block" : ""} ${slot.className} ${spreadOnHover}`}
                style={{ "--sx": slot.spread[0], "--sy": slot.spread[1], "--sr": slot.spread[2] } as CSSProperties}
              >
                <Polaroid
                  image={img}
                  alt={img.alt}
                  caption={img.caption}
                  seed={`${p.slug}-pol-${i}`}
                  tape={i === 0 ? [{ position: "top", color: slot.tape as TapeColor }] : []}
                  sizes="(min-width: 768px) 15vw, 44vw"
                />
              </div>
            );
          })}
        </div>

        {p.lineArt && (
          <LineArt
            name={p.lineArt}
            redrawOnHover
            className="absolute -top-[6%] left-[38%] z-20 w-[40%] md:left-[44%] md:w-[34%]"
          />
        )}
      </div>

      {/* Text column */}
      <div
        className={`relative col-span-4 flex flex-col gap-6 md:row-start-2 md:col-span-4 md:self-center ${
          flip ? "md:col-start-1" : "md:col-start-9"
        }`}
      >
        <div>
          <h2 id={titleId} className="font-display text-5xl leading-[0.92] md:text-6xl">
            <Link
              href={href}
              className="after:absolute after:inset-0 after:z-30 after:content-[''] focus-visible:outline-none"
            >
              {p.title}
            </Link>
          </h2>
          <p className="mt-3 font-mono text-label-sm uppercase tracking-[0.18em] text-ink-soft">
            {p.year} · {p.role}
          </p>
        </div>

        <SwatchRow colors={p.palette} size="sm" />

        <p className="font-mono text-type text-ink">{p.summary}</p>

        {p.note && (
          <div className="relative flex items-start gap-2">
            <Scribble variant="arrow" className="mt-1 h-8 w-12 shrink-0 -scale-x-100" />
            <Note seed={p.slug} tone="marker" size="sm">
              {p.note}
            </Note>
          </div>
        )}

        <Label className="mt-2">view project →</Label>
      </div>
    </article>
  );
}
