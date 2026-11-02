import Image from "next/image";
import type { ResolvedMediaBlock, ResolvedMediaItem } from "@/lib/projects";
import { FlipBook } from "./FlipBook";
import { YouTube } from "./YouTube";

/** One image, GIF, video or "to come" frame, cropped to `aspect` unless it's a video. */
function Item({
  item,
  aspect,
  ratio,
  sizes,
  label,
}: {
  item: ResolvedMediaItem;
  aspect: string;
  /** Overrides `aspect` with an exact ratio such as "2/3". */
  ratio?: string;
  sizes: string;
  label?: string;
}) {
  const shape = ratio ? { aspectRatio: ratio } : undefined;
  if (ratio) aspect = "";
  return (
    <figure>
      {item.kind === "image" ? (
        <div className={`relative overflow-hidden bg-paper-deep ${aspect}`} style={shape}>
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
          style={shape}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className={`flex items-center justify-center border border-dashed border-red/40 ${aspect}`} style={shape}>
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
    case "row": {
      const cols = { 2: "grid-cols-2 md:max-w-[40rem]", 3: "grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[block.columns ?? 3] ?? "grid-cols-3";
      const n = block.columns ?? 3;
      return (
        <div className={`grid gap-2 md:gap-4 ${cols}`}>
          {items.map((it, i) => (
            <Item key={i} item={it} aspect="aspect-[3/4]" ratio={block.ratio} sizes={`(min-width: 768px) ${Math.round(60 / n)}vw, ${Math.round(96 / Math.min(n, 2))}vw`} />
          ))}
        </div>
      );
    }
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
