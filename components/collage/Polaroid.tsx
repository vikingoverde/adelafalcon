import Image from "next/image";
import type { ImageData } from "@/lib/images";
import { seededRotation } from "@/lib/seeded";
import { TapeStrip, type TapeColor, type TapePosition } from "./TapeStrip";

type Props = {
  image: ImageData;
  alt: string;
  caption?: string;
  /** Stable key for the random rotation (-6°…6°). */
  seed: string;
  /** Override the seeded rotation, in degrees. */
  rotate?: number;
  tape?: { position: TapePosition; color?: TapeColor }[];
  sizes: string;
  priority?: boolean;
  /** Aspect ratio of the photo window. */
  aspect?: "square" | "portrait" | "landscape";
  className?: string;
};

const aspects = { square: "aspect-square", portrait: "aspect-[4/5]", landscape: "aspect-[5/4]" };

/** Instant-film print: white border, deeper chin, handwritten caption. */
export function Polaroid({
  image,
  alt,
  caption,
  seed,
  rotate,
  tape = [],
  sizes,
  priority,
  aspect = "square",
  className = "",
}: Props) {
  const r = rotate ?? seededRotation(seed);
  return (
    <figure
      className={`relative bg-paper-white p-2.5 pb-11 shadow-paper transition-shadow duration-300 md:p-3 md:pb-14 ${className}`}
      style={{ transform: `rotate(${r}deg)` }}
    >
      {tape.map((t) => (
        <TapeStrip key={t.position} position={t.position} color={t.color} seed={seed} />
      ))}
      <div className={`relative overflow-hidden bg-paper-deep ${aspects[aspect]}`}>
        <Image
          src={image.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={image.blurDataURL ? "blur" : "empty"}
          blurDataURL={image.blurDataURL}
          className="object-cover"
        />
        {/* faint print sheen */}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      </div>
      {caption && (
        <figcaption className="absolute inset-x-3 bottom-2.5 truncate text-center font-hand text-xl leading-none text-ink md:bottom-3.5 md:text-2xl">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
