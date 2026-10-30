import { CollageBoard, CollageItem } from "@/components/collage/CollageItem";
import { LineArt } from "@/components/collage/LineArt";
import { Note } from "@/components/collage/Note";
import { Polaroid } from "@/components/collage/Polaroid";
import { PosterCard } from "@/components/collage/PosterCard";
import { Print } from "@/components/collage/Print";
import { Scribble } from "@/components/collage/Scribble";
import { ScriptCard } from "@/components/collage/ScriptCard";
import { SketchCard } from "@/components/collage/SketchCard";
import { SwatchRow } from "@/components/collage/Swatch";
import { TapedPhoto } from "@/components/collage/TapedPhoto";
import { AdjectiveList } from "@/components/ui/AdjectiveList";
import { CornerLabels } from "@/components/ui/CornerLabels";
import { Label } from "@/components/ui/Label";
import { NameLogo } from "@/components/ui/NameLogo";
import { ScribbleLink } from "@/components/ui/ScribbleLink";
import { getImage, ph } from "@/lib/images";
import { getProjects } from "@/lib/projects";
import { pageCounter, site } from "@/lib/site";

export default async function HomePage() {
  const projects = await getProjects();
  const featured = projects[0];

  return (
    <>
      <CornerLabels left="project mood" right={pageCounter("/")} />

      {/*
        The hero is one editorial moodboard "slide": sparse flat prints on the grid, a small
        adjective list, and a big brat-green line-drawn tiger crawling across everything.
        Desktop positions are percentages of a 16:10 board; on mobile it becomes a single column.
      */}
      <section aria-labelledby="hero-title" className="sheet relative mt-6 md:mt-4">
        <CollageBoard className="md:aspect-[16/10]">
          {/* Name + tagline (top right) */}
          <CollageItem index={0} x="70%" y="2%" w="30%" z={6} eager mobileWidth="100%" align="start">
            <h1 id="hero-title" className="text-ink">
              <NameLogo title="" className="h-auto w-full max-w-[26rem]" />
              <span className="sr-only">{site.name}</span>
            </h1>
            <p className="mt-4 max-w-[30ch] font-mono text-type text-ink-soft">
              {site.role} — {site.tagline}
            </p>
          </CollageItem>

          {/* Script lettering card (top left) */}
          <CollageItem index={1} x="0%" y="4%" w="12%" z={2} depth={10} draggable eager align="start" mobileWidth="44%" className="hidden md:block">
            <ScriptCard lines={["soft", "tigers"]} />
          </CollageItem>

          {/* Adjectives (left, middle) */}
          <CollageItem index={2} x="0%" y="56%" w="12%" z={5} eager align="start" mobileWidth="100%">
            <AdjectiveList words={site.adjectives} />
          </CollageItem>

          {/* Main photo (centre) */}
          <CollageItem index={3} x="44%" y="3%" w="25%" z={2} depth={14} draggable eager align="center" mobileWidth="82%">
            <Print
              image={getImage(ph("look-13"))}
              alt="Placeholder: a figure in a lilac dress against a pale wall"
              aspectClassName="aspect-[4/5]"
              sizes="(min-width: 768px) 25vw, 82vw"
              priority
            />
          </CollageItem>

          {/* Big tiger crossing the board (bottom left) */}
          <CollageItem index={4} x="9%" y="44%" w="52%" z={4} depth={-12} eager align="center" mobileWidth="100%" className="-mt-20 md:mt-0">
            <LineArt name="tigerFull" strokeWidth={2} duration={3.2} delay={0.4} />
          </CollageItem>

          {/* Zine poster (left, under the script card) */}
          <CollageItem index={5} x="15%" y="18%" w="14%" z={3} depth={24} draggable align="start" mobileWidth="56%">
            <PosterCard
              title="Sketch"
              kicker="the sketchbook · no. 14"
              meta={["vol. 14", "ss27", String(site.year)]}
              images={[
                { image: getImage(ph("look-11")), alt: "Placeholder: a peach sunset over dark water" },
                { image: getImage(ph("look-14")), alt: "Placeholder: soft fabric folds" },
              ]}
              sizes="(min-width: 768px) 12vw, 50vw"
            />
          </CollageItem>

          {/* Small print (bottom right) */}
          <CollageItem index={6} x="80%" y="62%" w="15%" z={3} depth={30} draggable align="end" mobileWidth="60%">
            <Print
              image={getImage(ph("look-04"))}
              alt="Placeholder: pale stone arches with soft shadows"
              aspectClassName="aspect-[5/4]"
              grayscale
              sizes="(min-width: 768px) 15vw, 60vw"
              label="light study"
            />
          </CollageItem>

          {/* Small red ornaments (desktop only, never over body text) */}
          <LineArt name="swirl" className="absolute left-[62%] top-[50%] z-[5] hidden w-[13%] md:block" delay={2.2} />
          <LineArt name="blossom" className="absolute left-[12%] top-[80%] z-[5] hidden w-[3.2%] md:block" delay={3} />
          <LineArt name="blossom" className="absolute left-[33%] top-[90%] z-[5] hidden w-[2.6%] rotate-12 md:block" delay={3.3} />
          <LineArt name="blossom" className="absolute left-[74%] top-[50%] z-[5] hidden w-[2.4%] -rotate-12 md:block" delay={3.6} />
        </CollageBoard>
      </section>

      {/* The scrapbook layer: messier, draggable, taped. */}
      <section aria-labelledby="sketchbook-title" className="sheet relative mt-28 md:mt-36">
        <div className="mb-3 flex items-baseline justify-between">
          <Label>sketchbook — process</Label>
          <Label tone="ink" className="hidden md:inline">drag to rearrange ↘</Label>
        </div>
        <h2 id="sketchbook-title" className="mb-8 font-display text-5xl leading-none md:mb-0 md:text-7xl">
          From the <span className="italic">sketchbook</span>
        </h2>
        <CollageBoard className="md:h-[min(64vw,820px)]">
          <CollageItem index={0} x="3%" y="8%" w="30%" z={2} depth={18} draggable align="start" mobileWidth="88%">
            <TapedPhoto
              image={getImage(ph("look-01"))}
              alt="Placeholder: a figure in a long blush dress standing in front of a pale wall"
              seed="hero-main"
              rotate={-2.5}
              tape={[{ position: "tl", color: "butter" }, { position: "br", color: "sky" }]}
              sizes="(min-width: 768px) 30vw, 88vw"
            />
          </CollageItem>

          <CollageItem index={1} x="29%" y="46%" w="19%" z={4} depth={36} draggable align="end">
            <Polaroid
              image={getImage(ph("look-03"))}
              alt="Placeholder: soft yellow flowers on a cream background"
              caption="first fitting ♡"
              seed="hero-pol-1"
              tape={[{ position: "top", color: "blush" }]}
              sizes="(min-width: 768px) 19vw, 78vw"
            />
          </CollageItem>

          <CollageItem index={2} x="38%" y="4%" w="20%" z={3} depth={10} draggable align="start">
            <SketchCard seed="hero-sketch" notes={["raw hem", "silk?"]} />
          </CollageItem>

          <CollageItem index={3} x="60%" y="10%" w="20%" z={2} depth={28} draggable align="end">
            <Polaroid
              image={getImage(ph("look-05"))}
              alt="Placeholder: a calm blue sea under a pale sky"
              caption="sea, june"
              seed="hero-pol-2"
              aspect="portrait"
              sizes="(min-width: 768px) 20vw, 78vw"
            />
          </CollageItem>

          <CollageItem index={4} x="56%" y="58%" w="24%" z={3} depth={14} draggable align="start" mobileWidth="84%">
            <TapedPhoto
              image={getImage(ph("look-06"))}
              alt="Placeholder: close-up of a lilac knit texture"
              seed="hero-torn"
              torn={["top", "right", "bottom"]}
              tape={[{ position: "tl", color: "accent" }]}
              aspectClassName="aspect-[4/3]"
              sizes="(min-width: 768px) 24vw, 84vw"
            />
          </CollageItem>

          <CollageItem index={5} x="83%" y="38%" w="15%" z={5} depth={44} draggable align="end" mobileWidth="60%">
            <Polaroid
              image={getImage(ph("look-09"))}
              alt="Placeholder: pink and plum flowers scattered on pale pink paper"
              caption="mood"
              seed="hero-pol-3"
              sizes="(min-width: 768px) 15vw, 60vw"
            />
          </CollageItem>

          <CollageItem index={6} x="5%" y="76%" w="30%" z={5} depth={22} align="center" mobileWidth="90%">
            <SwatchRow colors={["#F4C6CF", "#F6E7A8", "#C9DDF0", "#CFE8D5", "#8ACE00"]} />
            <Note seed="sw" rotate={-4} size="sm" tone="accent" className="mt-3">
              palette for ss27 — keep it soft, one loud green
            </Note>
          </CollageItem>

          <LineArt name="tiger" className="absolute left-[15%] top-[22%] z-10 hidden w-[26%] md:block" delay={0.4} />
          <LineArt name="cloud" className="absolute right-[2%] top-[-2%] z-10 hidden w-[20%] md:block" delay={1.2} />
          <Scribble
            variant="circle"
            color="accent"
            className="absolute left-[79%] top-[32%] z-10 hidden h-[34%] w-[22%] md:block"
            delay={1}
          />
        </CollageBoard>
      </section>

      {featured && (
        <section aria-labelledby="featured" className="sheet-cols mt-24 items-end gap-y-6 md:mt-32">
          <Label className="col-span-4 md:col-span-2">featured</Label>
          <h2 id="featured" className="col-span-4 font-display text-5xl leading-[0.95] md:col-span-6 md:text-7xl">
            {featured.title}
          </h2>
          <div className="col-span-4 md:col-span-4 md:text-right">
            <ScribbleLink href="/work" color="accent" className="font-label text-label font-semibold uppercase text-accent-ink">
              see all work →
            </ScribbleLink>
          </div>
        </section>
      )}
    </>
  );
}
