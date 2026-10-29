type Props = { lines: string[]; header?: string; className?: string };

/** A small card with a typed header and big handwritten lettering on a highlighter-green card — like a label sample. */
export function ScriptCard({ lines, header = "colour study · no. 3", className = "" }: Props) {
  return (
    <figure
      className={`aspect-[4/5] bg-accent p-[8%] shadow-[0_1px_2px_rgba(30,30,28,0.08),0_10px_24px_-14px_rgba(30,30,28,0.35)] ${className}`}
    >
      <p className="font-mono text-[0.45rem] uppercase leading-relaxed tracking-[0.18em] text-ink">{header}</p>
      <p className="mt-[10%] font-hand text-[clamp(1.6rem,3vw,3rem)] leading-[0.8] text-ink">
        {lines.map((l, i) => (
          <span key={l} className="block" style={{ paddingLeft: `${i * 18}%`, transform: `rotate(${-6 + i * 3}deg)` }}>
            {l}
          </span>
        ))}
      </p>
    </figure>
  );
}
