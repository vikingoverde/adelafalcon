import { Note } from "@/components/collage/Note";
import { TapedPhoto } from "@/components/collage/TapedPhoto";
import type { TapeColor, TapePosition } from "@/components/collage/TapeStrip";
import type { Project } from "@/lib/projects";

const tapes: { position: TapePosition; color: TapeColor }[] = [
  { position: "top", color: "butter" },
  { position: "tl", color: "blush" },
  { position: "tr", color: "sky" },
  { position: "top", color: "accent" },
  { position: "tl", color: "mint" },
];

/** Horizontal, keyboard-scrollable strip of taped process images. */
export function ProcessGallery({ items, title }: { items: Project["galleryImages"]; title: string }) {
  return (
    <div className="relative my-10 ml-[calc(50%-50vw)] w-screen">
      <ul
        tabIndex={0}
        aria-label={`${title} — process images, scroll horizontally`}
        className="no-scrollbar flex snap-x snap-mandatory gap-10 overflow-x-auto px-6 pb-10 pt-8 md:gap-14 md:px-[max(2rem,calc(50vw-42rem))]"
      >
        {items.map((img, i) => (
          <li key={img.src + i} className="w-[72vw] shrink-0 snap-center sm:w-[44vw] md:w-[26rem]">
            <TapedPhoto
              image={img}
              alt={img.alt}
              seed={`process-${title}-${i}`}
              maxRotation={3.5}
              tape={[tapes[i % tapes.length]!]}
              torn={i % 3 === 2 ? ["bottom"] : undefined}
              sizes="(min-width: 768px) 26rem, (min-width: 640px) 44vw, 72vw"
            />
            {img.caption && (
              <Note seed={img.caption} size="sm" className="mt-4 pl-2">
                {String(i + 1).padStart(2, "0")} — {img.caption}
              </Note>
            )}
          </li>
        ))}
      </ul>
      <p aria-hidden="true" className="px-6 font-label text-label uppercase text-accent-ink md:px-[max(2rem,calc(50vw-42rem))]">
        scroll →
      </p>
    </div>
  );
}
