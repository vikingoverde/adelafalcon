import type { Metadata } from "next";
import { Credits } from "@/components/ui/Credits";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: `Get in touch with ${site.name}.` };

export default function ContactPage() {
  return (
    <div className="sheet pt-28 md:pt-36">
      <h1 className="sr-only">Contact</h1>
      <Credits axis="52%" mobileAxis="0%" rows={[{ values: ["Commissions, collaborations", `and nice pictures of tigers ${site.year}`] }]} />

      <Credits
        className="mt-16 md:mt-24"
        axis="22%"
        size="lg"
        rows={[
          {
            label: "Write to",
            values: (
              <a href={`mailto:${site.email}`} className="break-all underline-offset-[6px] hover:underline">
                {site.email}
              </a>
            ),
          },
        ]}
      />

      <Credits
        className="mt-16 md:mt-24"
        axis="52%"
        rows={[
          ...site.socials.map((s) => ({
            key: s.label,
            label: s.label,
            values: (
              <a href={s.href} className="underline-offset-4 hover:underline">
                {s.href.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
              </a>
            ),
          })),
          { label: "Based in", values: site.basedIn },
          { label: "Available for", values: ["Freelance", "Collaborations", "Workshops"] },
        ]}
      />

      <Credits className="mt-16 md:mt-24" axis="52%" rows={[{ label: " ", values: `©${site.year} ${site.name}.` }]} />
    </div>
  );
}
