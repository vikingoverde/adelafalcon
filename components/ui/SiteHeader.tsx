"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

function sectionLabel(pathname: string) {
  if (pathname === "/") return "Index";
  if (pathname.startsWith("/work/")) return "Project";
  return pathname.split("/")[1] ?? "Index";
}

/** Corner menu: name top-left, current section in brackets top-centre, links top-right. */
export function SiteHeader() {
  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-paper">
      <a
        href="#main"
        className="sr-only z-[100] bg-red px-3 py-2 text-nav uppercase text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Skip to content
      </a>
      <nav aria-label="Main" className="sheet grid grid-cols-[1fr_auto] items-baseline py-3 text-nav uppercase md:grid-cols-3">
        <Link href="/" className="justify-self-start hover:underline hover:underline-offset-4">
          {site.name}
        </Link>
        <p aria-hidden="true" className="hidden justify-self-center md:block">
          ({sectionLabel(pathname)})
        </p>
        <ul className="flex gap-4 justify-self-end md:gap-6">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className="underline-offset-4 hover:underline aria-[current=page]:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
