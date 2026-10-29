import type { Metadata } from "next";
import { LineArt } from "@/components/collage/LineArt";
import { Note } from "@/components/collage/Note";
import { CornerLabels } from "@/components/ui/CornerLabels";
import { Label } from "@/components/ui/Label";
import { ScribbleLink } from "@/components/ui/ScribbleLink";
import { pageCounter, site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: `Get in touch with ${site.name}.` };

export default function ContactPage() {
  return (
    <>
      <CornerLabels left="contact — say hello" right={pageCounter("/contact")} />
      <section aria-labelledby="contact-title" className="sheet-cols relative mt-16 min-h-[60vh] content-center gap-y-10 md:mt-24">
        <h1 id="contact-title" className="col-span-4 md:col-span-12">
          <Label as="span" className="mb-6 block">
            write to me
          </Label>
          <ScribbleLink
            href={`mailto:${site.email}`}
            className="break-all font-display text-[clamp(2.6rem,9vw,8.5rem)] leading-none text-accent-ink"
            scribbleClassName="-bottom-2 h-5 md:-bottom-4 md:h-8"
            strokeWidth={4}
          >
            {site.email}
          </ScribbleLink>
        </h1>
        <Note seed="contact" rotate={-4} size="lg" className="col-span-4 md:col-span-5 md:col-start-6">
          commissions, collaborations, or just a nice picture of a tiger.
        </Note>
        <ul aria-label="Elsewhere" className="col-span-4 flex flex-wrap gap-x-8 gap-y-3 md:col-span-12">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                className="font-label text-label font-medium uppercase text-accent-ink underline-offset-4 hover:underline"
              >
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <LineArt name="tiger" className="pointer-events-none absolute -top-8 right-4 -z-0 hidden w-56 opacity-80 md:block" />
      </section>
    </>
  );
}
