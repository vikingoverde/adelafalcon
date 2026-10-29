import Image from "next/image";
import type { ImageData } from "@/lib/images";
import { seededRotation } from "@/lib/seeded";
import { TapeStrip, type TapeColor, type TapePosition } from "./TapeStrip";
import { TornPaper, type TornEdge } from "./TornPaper";

type Props = {
  image: ImageData;
  alt: string;
  seed: string;
  rotate?: number;
  maxRotation?: number;
  tape?: { position: TapePosition; color?: TapeColor }[];
  torn?: TornEdge[];
  sizes: string;
  priority?: boolean;
  /** Tailwind aspect class; defaults to the image's own ratio. */
  aspectClassName?: string;
  className?: string;
};

/** A loose photo print stuck down with tape, optionally with torn edges. */
export function TapedPhoto({
  image,
  alt,
  seed,
  rotate,
  maxRotation = 3,
  tape = [{ position: "top" }],
  torn,
  sizes,
  priority,
  aspectClassName,
  className = "",
}: Props) {
  const r = rotate ?? seededRotation(seed, maxRotation);
  const photo = (
    <div
      className={`relative overflow-hidden bg-paper-deep ${aspectClassName ?? ""}`}
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
        className="object-cover"
      />
    </div>
  );
  return (
    <div className={`relative ${className}`} style={{ transform: `rotate(${r}deg)` }}>
      {tape.map((t) => (
        <TapeStrip key={t.position} position={t.position} color={t.color} seed={seed} />
      ))}
      {torn?.length ? (
        <TornPaper edges={torn} seed={seed}>
          {photo}
        </TornPaper>
      ) : (
        <div className="shadow-paper">{photo}</div>
      )}
    </div>
  );
}
