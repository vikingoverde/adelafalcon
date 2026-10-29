import Link from "next/link";
import { formatCounter } from "@/lib/site";
import { Label } from "./Label";

type Item = { slug: string; title: string };

export function ProjectPager({ prev, next, index, total }: { prev: Item; next: Item; index: number; total: number }) {
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;
  const card =
    "group flex flex-col gap-3 rounded-sm border-t border-ink/15 pt-5 transition-colors hover:border-accent-ink";
  return (
    <nav aria-label="More projects" className="sheet-cols mt-28 gap-y-10">
      <Link href={`/work/${prev.slug}`} className={`col-span-4 md:col-span-5 ${card}`} data-cursor="view">
        <Label>← previous · {formatCounter(prevIndex + 1, total)}</Label>
        <span className="font-display text-4xl leading-none group-hover:italic md:text-6xl">{prev.title}</span>
      </Link>
      <Link
        href={`/work/${next.slug}`}
        className={`col-span-4 items-end text-right md:col-span-5 md:col-start-8 ${card}`}
        data-cursor="view"
      >
        <Label>next · {formatCounter(nextIndex + 1, total)} →</Label>
        <span className="font-display text-4xl leading-none group-hover:italic md:text-6xl">{next.title}</span>
      </Link>
    </nav>
  );
}
