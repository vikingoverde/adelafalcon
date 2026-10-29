import type { ReactNode } from "react";
import { seededRotation } from "@/lib/seeded";

type Props = {
  children: ReactNode;
  seed?: string;
  rotate?: number;
  tone?: "ink" | "marker" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
  as?: "p" | "span";
};

const tones = { ink: "text-ink", marker: "text-marker-ink", accent: "text-accent-ink" };
const sizes = { sm: "text-xl md:text-2xl", md: "text-2xl md:text-3xl", lg: "text-3xl md:text-[2.6rem]" };

/** A handwritten margin note, slightly tilted. */
export function Note({ children, seed = "note", rotate, tone = "ink", size = "md", className = "", as: Tag = "p" }: Props) {
  return (
    <Tag
      className={`inline-block font-hand leading-[1.05] ${tones[tone]} ${sizes[size]} ${className}`}
      style={{ transform: `rotate(${rotate ?? seededRotation(seed, 5)}deg)` }}
    >
      {children}
    </Tag>
  );
}
