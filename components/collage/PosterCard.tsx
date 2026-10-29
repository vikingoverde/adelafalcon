import Image from "next/image";
import type { ImageData } from "@/lib/images";

type Props = {
  title: string;
  kicker?: string;
  meta?: [string, string, string];
  images: { image: ImageData; alt: string }[];
  sizes: string;
  className?: string;
};

/** A small typographic poster/zine cover: tiny header, title on a green band, stacked duotone photos. */
export function PosterCard({ title, kicker = "the sketchbook", meta, images, sizes, className = "" }: Props) {
  return (
    <figure
      className={`bg-paper-white px-[7%] pb-[7%] pt-[6%] shadow-[0_1px_2px_rgba(30,30,28,0.08),0_10px_24px_-14px_rgba(30,30,28,0.35)] ${className}`}
    >
      <p aria-hidden="true" className="text-center font-mono text-[0.5rem] uppercase tracking-[0.2em] text-ink-soft">{kicker}</p>
      <p
        aria-hidden="true"
        className="mt-1 bg-accent pb-0.5 pt-1 text-center font-display text-[clamp(1.4rem,2.6vw,2.6rem)] uppercase leading-none tracking-tight text-ink"
      >
        {title}
      </p>
      {meta && (
        <p aria-hidden="true" className="mt-1 flex justify-between font-mono text-[0.45rem] uppercase tracking-[0.15em] text-ink-soft">
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </p>
      )}
      <div className="mt-[7%] flex flex-col gap-[5%]">
        {images.map(({ image, alt }) => (
          <div key={image.src} className="relative aspect-[5/4] overflow-hidden bg-paper-deep">
            <Image
              src={image.src}
              alt={alt}
              fill
              sizes={sizes}
              placeholder={image.blurDataURL ? "blur" : "empty"}
              blurDataURL={image.blurDataURL}
              className="object-cover grayscale contrast-125"
            />
          </div>
        ))}
      </div>
      <figcaption className="sr-only">Poster: {title}</figcaption>
    </figure>
  );
}
