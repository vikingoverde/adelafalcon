import type { ReactNode } from "react";

/** Tiny tracked-out uppercase label in the accent colour — the editorial voice of the site. */
export function Label({
  children,
  className = "",
  as: Tag = "span",
  tone = "accent",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "h2" | "h3" | "dt" | "dd" | "li";
  tone?: "accent" | "ink";
}) {
  return (
    <Tag
      className={`font-label text-label font-medium lowercase tracking-[0.04em] ${tone === "accent" ? "text-accent-ink" : "text-ink-soft"} ${className}`}
    >
      {children}
    </Tag>
  );
}
