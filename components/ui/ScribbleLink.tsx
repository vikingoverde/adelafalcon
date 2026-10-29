"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Scribble } from "@/components/collage/Scribble";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  scribbleClassName?: string;
  color?: "marker" | "accent" | "ink";
  strokeWidth?: number;
};

/** A link whose marker underline draws itself on hover and keyboard focus. */
export function ScribbleLink({
  href,
  children,
  className = "",
  scribbleClassName = "-bottom-3 h-3",
  color = "marker",
  strokeWidth = 3,
}: Props) {
  const [active, setActive] = useState(false);
  const on = () => setActive(true);
  const off = () => setActive(false);
  const isInternal = href.startsWith("/");
  const props = {
    className: `relative inline-block ${className}`,
    onMouseEnter: on,
    onMouseLeave: off,
    onFocus: on,
    onBlur: off,
  };
  const inner = (
    <>
      {children}
      <Scribble
        variant="underline"
        trigger="manual"
        active={active}
        color={color}
        strokeWidth={strokeWidth}
        duration={0.5}
        className={`absolute left-0 w-full ${scribbleClassName}`}
      />
    </>
  );
  return isInternal ? (
    <Link href={href} {...props}>
      {inner}
    </Link>
  ) : (
    <a href={href} {...props}>
      {inner}
    </a>
  );
}
