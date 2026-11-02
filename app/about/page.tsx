import type { Metadata } from "next";
import { Credits } from "@/components/ui/Credits";
import { NameLogo } from "@/components/ui/NameLogo";
import { Photo } from "@/components/ui/Photo";
import { getImage, ph } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name}, a multidisciplinary designer fueled by curiosity and ambition. Born in Zaragoza, raised around the world.`,
};

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
        {/*
          Adela's handwritten note, traced to a vector (public/brand/about-note.svg, from
          about-note-original.png). The same words are in the sr-only text below so screen
          readers and search engines can read them.
        */}
        <figure className="max-w-[34rem]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed */}
          <img src="/brand/about-note.svg" alt="" aria-hidden="true" width={481} height={611} className="h-auto w-full" />
          <figcaption className="sr-only">
            <p>Hello, I&rsquo;m Adela Falcón, a multidisciplinary designer fueled by curiosity and ambition.</p>
            <p>
              I was born in Zaragoza, Spain and raised around the world — learning from new cultures &amp; people (+ being
              inspired by the vibrant connections between different music, cultures, art, architecture, fashion…).
            </p>
            <p>
              Over the years I started developing little passions, in which I dabble creatively — graphic design, 3D
              modeling, creative direction, architecture, fashion, photography &amp; many more!
            </p>
            <p>
              My projects are a reflection of my personality and mind. They keep me inspired and evolving. With these
              projects I&rsquo;m able to express myself through storytelling, emotions, design and experiences.
            </p>
            <p>
              So without further ado… Welcome to my portfolio — a curated glimpse into the complexity that is a
              human&rsquo;s creative mind.
            </p>
          </figcaption>
        </figure>
      </div>

      <div className="mt-24 grid gap-16 md:mt-32 md:gap-24">
        <Credits
          axis="22%"
          rows={[
            { label: "Designed by", values: site.name },
            { label: "Discipline", values: [...site.disciplines] },
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
