import Image from "next/image";
import type { ResolvedMediaBlock, ResolvedMediaItem } from "@/lib/projects";
import { FlipBook } from "./FlipBook";
import { YouTube } from "./YouTube";

/** One image, GIF, video or "to come" frame, cropped to `aspect` unless it's a video. */
function Item({ item, aspect, sizes, label }: { item: ResolvedMediaItem; aspect: string; sizes: string; label?: string }) {
  return (
    <figure>
      {item.kind === "image" ? (
        <div className={`relative overflow-hidden bg-paper-deep ${aspect}`}>
          <Image
            src={item.image.src}
            alt={item.alt}
            fill
            sizes={sizes}
            // Animated GIFs are served as-is so they keep moving.
            unoptimized={item.image.src.toLowerCase().endsWith(".gif")}
            placeholder={item.image.blurDataURL ? "blur" : "empty"}
            blurDataURL={item.image.blurDataURL}
            className="object-cover"
          />
        </div>
      ) : item.kind === "video" ? (
        <video
          src={item.src}
          aria-label={item.alt}
          className={`w-full bg-paper-deep object-cover ${aspect}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className={`flex items-center justify-center border border-dashed border-red/40 ${aspect}`}>
          <span className="px-3 text-center text-micro uppercase">(To come)</span>
        </div>
      )}
      {(item.caption ?? (item.kind === "placeholder" ? label : undefined)) && (
        <figcaption className="mt-2 text-micro uppercase">{item.caption ?? label}</figcaption>
      )}
    </figure>
  );
}

/** Renders a project's named media section. See `MediaBlockInput` in lib/projects.ts for the layouts. */
export function MediaBlock({ block, projectTitle }: { block: ResolvedMediaBlock; projectTitle: string }) {
  const { items } = block;
  switch (block.layout) {
    case "single":
      return items[0] ? (
        <Item item={items[0]} aspect="aspect-[4/3]" sizes="(min-width: 768px) 62vw, 100vw" label={block.caption} />
      ) : null;
    case "row":
      return (
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {items.map((it, i) => (
            <Item key={i} item={it} aspect="aspect-[3/4]" sizes="(min-width: 768px) 20vw, 32vw" />
          ))}
        </div>
      );
    case "feature": {
      const [first, ...rest] = items;
      return (
        <div className="grid grid-cols-3 gap-2 md:grid-cols-[1.6fr_1fr] md:gap-4">
          {first && (
            <div className="col-span-3 md:col-span-1">
              <Item item={first} aspect="aspect-square" sizes="(min-width: 768px) 38vw, 100vw" />
            </div>
          )}
          <div className="col-span-3 grid grid-cols-3 gap-2 md:col-span-1 md:grid-cols-1 md:gap-4">
            {rest.map((it, i) => (
              <Item key={i} item={it} aspect="aspect-[4/3] md:aspect-[16/9]" sizes="(min-width: 768px) 24vw, 32vw" />
            ))}
          </div>
        </div>
      );
    }
    case "video":
      return (
        <figure>
          <YouTube id={block.youtube!} title={block.title ?? `${projectTitle} — video`} />
          {block.caption && <figcaption className="mt-2 text-micro uppercase">{block.caption}</figcaption>}
        </figure>
      );
    case "book":
      return <FlipBook pages={items} title={block.title ?? projectTitle} />;
  }
}
