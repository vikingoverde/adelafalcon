import { seededRotation } from "@/lib/seeded";

/** A strip of colour chips generated from a project's `palette` frontmatter. */
export function PaletteStrip({ colors }: { colors: string[] }) {
  return (
    <figure className="my-10">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-3 md:gap-4">
        {colors.map((c, i) => (
          <div
            key={c}
            className="flex flex-col bg-paper-white p-2 pb-3 shadow-paper"
            style={{ transform: `rotate(${seededRotation(c + i, 2.5)}deg)` }}
          >
            <span aria-hidden="true" className="block aspect-[4/3] w-full" style={{ background: c }} />
            <span className="mt-2 font-mono text-label-sm uppercase text-ink">{c}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 font-label text-label uppercase text-accent-ink">palette — {colors.length} colours</figcaption>
    </figure>
  );
}
