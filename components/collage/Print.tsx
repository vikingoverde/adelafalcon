import Image from "next/image";
import type { ImageData } from "@/lib/images";

type Props = {
  image: ImageData;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Tailwind aspect class; defaults to the image's own ratio. */
  aspectClassName?: string;
  /** Tiny accent label under the print, e.g. "look 07". */
  label?: string;
  grayscale?: boolean;
  className?: string;
};

/** A flat, unframed print lying straight on the editorial grid — the "clean moodboard" counterpart to <Polaroid>. */
export function Print({ image, alt, sizes, priority, aspectClassName, label, grayscale, className = "" }: Props) {
  return (
    <figure className={className}>
      <div
        className={`relative overflow-hidden bg-paper-deep shadow-[0_1px_2px_rgba(30,30,28,0.08),0_10px_24px_-14px_rgba(30,30,28,0.35)] ${aspectClassName ?? ""}`}
        style={aspectClassName ? undefined : { aspectRatio: `${image.width} / ${image.height}` }}
      >
        <Image
          src={image.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className={`object-cover ${grayscale ? "grayscale" : ""}`}
        />
      </div>
      {label && (
        <figcaption className="mt-2 font-label text-label-sm font-medium lowercase text-accent-ink">{label}</figcaption>
      )}
    </figure>
  );
}
