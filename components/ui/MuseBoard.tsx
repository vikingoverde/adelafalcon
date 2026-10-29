import { CollageBoard, CollageItem } from "@/components/collage/CollageItem";
import { LineArt } from "@/components/collage/LineArt";
import { Polaroid } from "@/components/collage/Polaroid";
import type { LineArtName } from "@/components/collage/line-art/drawings";
import type { Project } from "@/lib/projects";

/** A small three-print collage pulled from the start of the gallery. */
export function MuseBoard({ items, slug, lineArt }: { items: Project["galleryImages"]; slug: string; lineArt?: LineArtName }) {
  const picks = items.slice(0, 3);
  const pos = [
    { x: "0%", y: "6%", w: "36%", align: "start" as const },
    { x: "30%", y: "22%", w: "34%", align: "end" as const },
    { x: "62%", y: "0%", w: "36%", align: "start" as const },
  ];
  return (
    <div className="relative my-12">
      <CollageBoard className="md:h-[28rem]">
        {picks.map((img, i) => (
          <CollageItem key={img.src + i} index={i} {...pos[i]!} z={i + 1} depth={10 + i * 12} mobileWidth="70%">
            <Polaroid
              image={img}
              alt={img.alt}
              caption={img.caption}
              seed={`muse-${slug}-${i}`}
              tape={i === 1 ? [{ position: "top", color: "accent" }] : []}
              sizes="(min-width: 768px) 18rem, 70vw"
            />
          </CollageItem>
        ))}
        {lineArt && (
          <LineArt name={lineArt} className="absolute right-[4%] top-[40%] z-10 hidden w-40 md:block" />
        )}
      </CollageBoard>
    </div>
  );
}
