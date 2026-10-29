"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pages, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-paper via-paper/85 to-transparent pb-4">
      <a
        href="#main"
        className="sr-only z-[100] bg-ink px-3 py-2 font-label text-label uppercase text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        skip to content
      </a>
      <nav aria-label="Main" className="sheet-cols items-baseline pt-5">
        <Link
          href="/"
          className="col-span-2 font-display text-2xl leading-none text-ink md:col-span-3 md:text-[1.7rem]"
        >
          {site.firstName}
          <span className="font-hand text-xl text-marker-ink md:text-2xl"> {site.lastName.toLowerCase()}</span>
        </Link>
        <ul className="col-span-2 flex justify-end gap-4 md:col-span-9 md:gap-8">
          {pages.slice(1).map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                aria-current={isCurrent(p.href) ? "page" : undefined}
                className="relative py-2 font-label text-label font-medium uppercase text-ink transition-colors hover:text-accent-ink aria-[current=page]:text-accent-ink"
              >
                {p.label}
                {isCurrent(p.href) && (
                  <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-px w-full bg-accent-ink" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
