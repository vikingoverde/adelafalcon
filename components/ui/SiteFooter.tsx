import Link from "next/link";
import { site } from "@/lib/site";

/** Bottom corners, mirroring the header. */
export function SiteFooter() {
  return (
    <footer className="sheet mt-32 grid grid-cols-1 gap-3 pb-4 pt-6 text-nav uppercase md:grid-cols-3 md:items-end">
      <Link href="/" className="justify-self-start underline-offset-4 hover:underline">
        {site.name}
      </Link>
      <p className="md:justify-self-center">({site.role})</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 md:justify-self-end md:gap-x-6">
        {site.socials.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="underline-offset-4 hover:underline">
              {s.label} ↗
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
