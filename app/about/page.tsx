import type { Metadata } from "next";
import { Credits } from "@/components/ui/Credits";
import { NameLogo } from "@/components/ui/NameLogo";
import { Photo } from "@/components/ui/Photo";
import { getImage, ph } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: `About ${site.name}, ${site.role.toLowerCase()}.` };

export default function AboutPage() {
  return (
    <div className="sheet pt-28 md:pt-36">
      <h1 className="sr-only">About {site.name}</h1>

      <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[52%_1fr] md:gap-5">
        <NameLogo title="" className="h-auto w-full max-w-[26rem] text-ink md:justify-self-end md:pr-6" />
        <p className="text-credit uppercase">
          {site.role}
          <br />
          {site.basedIn} {site.year}
        </p>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-12 md:mt-28 md:grid-cols-[22%_1fr] md:gap-5">
        <div className="w-2/3 md:w-full">
          <Photo image={getImage(ph("portrait"))} alt={`Placeholder portrait of ${site.name}`} aspectClassName="aspect-[4/5]" sizes="(min-width: 768px) 20vw, 66vw" priority bw />
        </div>
        <div className="max-w-[58ch] space-y-4 text-body font-normal md:pl-0">
          <p>
            I&rsquo;m a fashion and visual designer who thinks with my hands. Most projects start as a scrap — a torn
            magazine corner, a fabric offcut, a doodle in the margin — and grow on the wall next to my desk until they
            become clothes, prints or identities.
          </p>
          <p>
            I studied fashion design, worked in a small knitwear studio, and now run an independent practice making
            capsule collections and the visual worlds around them.
          </p>
          <p>This bio is placeholder text — swap it in app/about/page.tsx.</p>
        </div>
      </div>

      <div className="mt-24 grid gap-16 md:mt-32 md:gap-24">
        <Credits
          axis="22%"
          rows={[
            { label: "Designed by", values: site.name },
            { label: "Discipline", values: ["Fashion", "Print", "Identity"] },
            { label: "Based in", values: site.basedIn },
          ]}
        />
        <Credits
          axis="52%"
          rows={[
            { label: "Services", values: [...site.services] },
            { label: "Tools", values: [...site.tools] },
            { label: "In a few words", values: site.adjectives.join(", ") },
          ]}
        />
        <Credits axis="52%" rows={[{ label: " ", values: `©${site.year} ${site.name}.` }]} />
      </div>
    </div>
  );
}
