import Image from "next/image";
import type { ImageData } from "@/lib/images";

type Props = {
  image: ImageData;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Tailwind aspect class; defaults to the image's own ratio. */
  aspectClassName?: string;
  /** Black & white until hovered. */
  bw?: boolean;
  className?: string;
};

/** next/image with blur placeholder, cropped to a frame. */
export function Photo({ image, alt, sizes, priority, aspectClassName, bw = false, className = "" }: Props) {
  return (
    <div
      className={`group/photo relative overflow-hidden bg-paper-deep ${aspectClassName ?? ""} ${className}`}
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
        className={`object-cover ${bw ? "bw group-hover/photo:[filter:none]" : ""}`}
      />
    </div>
  );
}
