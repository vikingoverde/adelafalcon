import { seededRange, seededRotation } from "@/lib/seeded";

type Props = {
  color: string;
  /** Show the hex code underneath in typewriter text. */
  label?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = { sm: "h-8 w-10", md: "h-12 w-14 md:h-14 md:w-16", lg: "h-20 w-24 md:h-24 md:w-28" };

/** An irregular paint dab. Shape and tilt are derived from the colour, so they're stable. */
export function Swatch({ color, label = false, size = "md", className = "" }: Props) {
  const r = (k: string) => Math.round(seededRange(color + k, 34, 66));
  const radius = `${r("a")}% ${r("b")}% ${r("c")}% ${r("d")}% / ${r("e")}% ${r("f")}% ${r("g")}% ${r("h")}%`;
  return (
    <span className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <span
        role="img"
        aria-label={`colour swatch ${color}`}
        className={`block ${sizes[size]}`}
        style={{
          borderRadius: radius,
          transform: `rotate(${seededRotation(color, 14)}deg)`,
          background: `radial-gradient(120% 90% at 30% 25%, rgba(255,255,255,0.28), transparent 55%), radial-gradient(90% 80% at 75% 85%, rgba(0,0,0,0.08), transparent 60%), ${color}`,
          boxShadow: "inset 0 0 0 1px rgba(30,30,28,0.05)",
        }}
      />
      {label && <span className="font-mono text-label-sm uppercase text-ink-soft">{color}</span>}
    </span>
  );
}

export function SwatchRow({ colors, label = false, size = "md", className = "" }: { colors: string[] } & Omit<Props, "color">) {
  return (
    <div className={`flex flex-wrap items-end gap-3 md:gap-4 ${className}`}>
      {colors.map((c) => (
        <Swatch key={c} color={c} label={label} size={size} />
      ))}
    </div>
  );
}
