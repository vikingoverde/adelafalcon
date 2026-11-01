import type { CSSProperties, ReactNode } from "react";

export type CreditRow = {
  /** Small right-aligned role label, e.g. "Directed by". Leave out for a value-only line. */
  label?: ReactNode;
  /** One or more names stacked under each other. */
  values: ReactNode | ReactNode[];
  key?: string;
};

type Props = {
  rows: CreditRow[];
  /** Where the label/name axis sits, as a share of the width (e.g. "30%"). Mobile uses `mobileAxis`. */
  axis?: string;
  mobileAxis?: string;
  /** "lg" for headline-sized names (work index). */
  size?: "md" | "lg";
  className?: string;
};

const sizes = { md: "text-credit", lg: "text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.05]" };

/**
 * Film end-credits block: small role labels right-aligned against an axis, names in
 * larger capitals to its right. Stack several blocks with different axes for the
 * staggered rhythm of a credits card.
 */
export function Credits({ rows, axis = "40%", mobileAxis = "38%", size = "md", className = "" }: Props) {
  return (
    <dl
      style={{ "--axis": axis, "--axis-m": mobileAxis } as CSSProperties}
      className={`grid grid-cols-[var(--axis-m)_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1.5 uppercase md:grid-cols-[var(--axis)_minmax(0,1fr)] md:gap-x-5 ${className}`}
    >
      {rows.map((row, i) => {
        const values = Array.isArray(row.values) ? row.values : [row.values];
        return (
          <div key={row.key ?? i} className="contents">
            <dt className="text-right text-micro">{row.label}</dt>
            <dd className={sizes[size]}>
              {values.map((v, j) => (
                <span key={j} className="block">
                  {v}
                </span>
              ))}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
