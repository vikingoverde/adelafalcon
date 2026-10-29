import Link from "next/link";
import { site } from "@/lib/site";
import { Label } from "./Label";

export function SiteFooter() {
  return (
    <footer className="sheet-cols mt-32 gap-y-6 border-t border-ink/10 pb-10 pt-6">
      <Label className="col-span-4 md:col-span-3">
        {site.name} — {site.year}
      </Label>
      <p className="col-span-4 font-mono text-type text-ink-soft md:col-span-5">
        made with paper, tape and too many tabs. all images and drawings are placeholders.
      </p>
      <ul className="col-span-4 flex flex-wrap gap-x-5 gap-y-2 md:col-span-4 md:justify-end">
        {site.socials.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className="font-label text-label font-medium uppercase text-accent-ink underline-offset-4 hover:underline"
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
