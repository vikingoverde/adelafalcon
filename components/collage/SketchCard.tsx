import { LineArt } from "./LineArt";
import { TapeStrip } from "./TapeStrip";
import { seededRotation } from "@/lib/seeded";
import type { LineArtName } from "./line-art/drawings";

type Props = {
  drawing?: LineArtName;
  seed?: string;
  notes?: string[];
  className?: string;
};

/** A torn-out sketchbook page with a pencil drawing and scribbled callouts. */
export function SketchCard({ drawing = "croquis", seed = "sketch", notes = [], className = "" }: Props) {
  return (
    <figure
      className={`relative bg-paper-white bg-[linear-gradient(transparent_23px,rgba(30,30,28,0.06)_24px)] bg-[length:100%_24px] px-6 pb-6 pt-8 shadow-paper ${className}`}
      style={{ transform: `rotate(${seededRotation(seed)}deg)` }}
    >
      <TapeStrip position="top" color="blush" seed={seed} />
      <LineArt name={drawing} color="ink" strokeWidth={1.3} className="mx-auto h-auto w-3/4" duration={3} />
      {notes.map((n, i) => (
        <span
          key={n}
          className="absolute font-hand text-lg leading-none text-marker-ink md:text-xl"
          style={{
            top: `${18 + i * 26}%`,
            [i % 2 ? "left" : "right"]: "6%",
            transform: `rotate(${seededRotation(n, 8)}deg)`,
          }}
        >
          {n}
        </span>
      ))}
      <figcaption className="sr-only">Pencil fashion sketch{notes.length ? `, annotated: ${notes.join(", ")}` : ""}</figcaption>
    </figure>
  );
}
