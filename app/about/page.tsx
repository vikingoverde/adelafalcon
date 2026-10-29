import type { Metadata } from "next";
import { CollageBoard, CollageItem } from "@/components/collage/CollageItem";
import { LineArt } from "@/components/collage/LineArt";
import { Note } from "@/components/collage/Note";
import { Polaroid } from "@/components/collage/Polaroid";
import { Scribble } from "@/components/collage/Scribble";
import { SketchCard } from "@/components/collage/SketchCard";
import { SwatchRow } from "@/components/collage/Swatch";
import { TapedPhoto } from "@/components/collage/TapedPhoto";
import { CornerLabels } from "@/components/ui/CornerLabels";
import { Label } from "@/components/ui/Label";
import { getImage, ph } from "@/lib/images";
import { pageCounter, site } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: `About ${site.name}, ${site.role}.` };

const services = ["Capsule & collection design", "Pattern cutting & toiles", "Textile & print design", "Art direction & styling", "Visual identity", "Workshops & sketchbook clubs"];
const tools = ["Pencil, marker, scissors", "Clo3D", "Illustrator & Photoshop", "Figma", "Procreate", "A very old sewing machine"];

export default function AboutPage() {
  return (
    <>
      <CornerLabels left="about — the person" right={pageCounter("/about")} />

      <section aria-labelledby="about-title" className="sheet-cols mt-8 gap-y-12">
        <div className="relative col-span-4 md:col-span-5 md:row-span-2">
          <div className="mx-auto w-[80%] md:mx-0 md:w-[78%]">
            <Polaroid
              image={getImage(ph("portrait"))}
              alt={`Placeholder portrait of ${site.name}`}
              caption="me, probably holding pins"
              seed="portrait"
              rotate={-3}
              aspect="portrait"
              tape={[
                { position: "tl", color: "accent" },
                { position: "br", color: "blush" },
              ]}
              sizes="(min-width: 768px) 30vw, 80vw"
              priority
            />
          </div>
          <LineArt name="flower" className="absolute -right-2 bottom-[-6%] z-10 w-24 md:right-[2%] md:w-32" />
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <h1 id="about-title" className="font-display text-6xl leading-[0.9] md:text-8xl">
            Hello, I&rsquo;m {site.firstName}.
          </h1>
          <Note seed="about-h" rotate={-2} tone="marker" size="md" className="mt-4">
            (the one with the sketchbook)
          </Note>
          <div className="typewriter mt-10 max-w-[56ch]">
            <p>
              I&rsquo;m a {site.role} who thinks with my hands. Most projects start as a scrap — a
              torn magazine corner, a fabric offcut, a doodle in the margin — and grow on the wall next to my desk
              until they become clothes, prints or identities.
            </p>
            <p>
              I studied fashion design, worked in a small knitwear studio, and now run an independent practice
              making capsule collections and the visual worlds around them. I like work that is precise in its
              structure and a little messy in its details.
            </p>
            <p>This bio is placeholder text — swap it in app/about/page.tsx.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="inspirations" className="sheet mt-28 md:mt-36">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 id="inspirations" className="font-display text-5xl md:text-6xl">
            Inspirations
          </h2>
          <Label>things on the wall</Label>
        </div>
        <CollageBoard className="md:h-[40rem]">
          <CollageItem index={0} x="0%" y="8%" w="24%" depth={14} draggable align="start">
            <Polaroid image={getImage(ph("look-11"))} alt="Placeholder: a peach sunset over dark water" caption="late light" seed="insp-1" sizes="(min-width: 768px) 22vw, 78vw" />
          </CollageItem>
          <CollageItem index={1} x="22%" y="30%" w="24%" z={3} depth={16} draggable align="end">
            <TapedPhoto
              image={getImage(ph("look-04"))}
              alt="Placeholder: pale stone arches with soft shadows"
              seed="insp-2"
              torn={["left", "bottom"]}
              tape={[{ position: "tr", color: "sky" }]}
              aspectClassName="aspect-[4/3]"
              sizes="(min-width: 768px) 26vw, 78vw"
            />
          </CollageItem>
          <CollageItem index={2} x="50%" y="0%" w="18%" z={2} depth={8} draggable align="start">
            <SketchCard seed="insp-sketch" notes={["volume!"]} />
          </CollageItem>
          <CollageItem index={3} x="72%" y="12%" w="22%" z={2} depth={24} draggable align="end">
            <Polaroid image={getImage(ph("look-16"))} alt="Placeholder: a figure in a stone-coloured coat" caption="grandmother's coat" seed="insp-3" aspect="portrait" sizes="(min-width: 768px) 22vw, 78vw" />
          </CollageItem>
          <CollageItem index={4} x="54%" y="70%" w="30%" z={4} depth={18} align="center" mobileWidth="90%">
            <SwatchRow colors={["#7A3B4C", "#E89AAE", "#F7D2B8", "#2F4A6B", "#8ACE00"]} size="sm" />
            <Note seed="insp-n" size="sm" className="mt-2">
              colours I keep coming back to
            </Note>
          </CollageItem>
          <LineArt name="cloud" className="absolute left-[30%] top-[-6%] z-10 hidden w-[20%] md:block" />
          <Scribble variant="star" className="absolute right-[3%] top-[70%] z-10 hidden h-14 w-14 md:block" />
        </CollageBoard>
      </section>

      <section aria-label="Services and tools" className="sheet-cols mt-28 gap-y-14">
        <div className="col-span-4 md:col-span-5 md:col-start-2">
          <h2 className="mb-6 font-display text-4xl md:text-5xl">Services</h2>
          <ol className="flex flex-col divide-y divide-ink/10 border-y border-ink/10 font-mono text-type">
            {services.map((s, i) => (
              <li key={s} className="flex gap-6 py-3">
                <span className="font-label text-label-sm text-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="col-span-4 md:col-span-4 md:col-start-8">
          <h2 className="mb-6 font-display text-4xl md:text-5xl">Tools</h2>
          <ul className="flex flex-col divide-y divide-ink/10 border-y border-ink/10 font-mono text-type">
            {tools.map((t) => (
              <li key={t} className="py-3">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
