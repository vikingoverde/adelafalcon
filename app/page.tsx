import Link from "next/link";
import { Credits } from "@/components/ui/Credits";
import { ImageStrip, type StripItem } from "@/components/ui/ImageStrip";
import { NameLogo } from "@/components/ui/NameLogo";
import { getProjects } from "@/lib/projects";
import { pad2, site } from "@/lib/site";

export default async function HomePage() {
  const projects = await getProjects();
  const years = projects.map((p) => p.year);
  const range = `${Math.min(...years)}—${Math.max(...years)}`;

  // Every cover and process image, in project order, each linking to its project.
  const items: StripItem[] = projects.flatMap((p) => [
    { href: `/work/${p.slug}`, image: p.coverImage, alt: p.coverAlt, title: p.title, detail: `${p.tagline ?? p.role}, ${p.year}` },
    ...p.galleryImages.map((g) => ({
      href: `/work/${p.slug}`,
      image: g,
      alt: g.alt,
      title: p.title,
      detail: `${g.caption ?? "process"}, ${p.year}`,
    })),
  ]);

  return (
    <>
      <h1 className="sr-only">
        {site.name} — {site.role}
      </h1>

      {/* The reel: one screen, image strip in the middle, labels in the corners. */}
      <section aria-label="Selected images" className="relative flex h-[100svh] min-h-[34rem] flex-col justify-center pt-10">
        <ImageStrip items={items} label={`Images from ${projects.length} projects, ${range}`} />

        <div className="sheet absolute inset-x-0 bottom-0 grid grid-cols-2 items-end gap-3 pb-4 text-nav uppercase md:grid-cols-3">
          <p>{site.role}</p>
          <p aria-hidden="true" className="hidden justify-self-center md:block">
            (Scroll)
          </p>
          <p className="justify-self-end text-right">
            <span className="hidden md:block">
              {projects.length} projects, {range},
              <br />
              each a reel of its own.
            </span>
            <Link href="/work" className="underline underline-offset-4">
              Explore the work
            </Link>
          </p>
        </div>
      </section>

      {/* The end credits. */}
      <section aria-label="Credits" className="sheet mt-24 md:mt-36">
        <div className="grid grid-cols-1 gap-16 md:gap-24">
          <Credits
            axis="52%"
            mobileAxis="0%"
            rows={[
              {
                values: [site.tagline, `${site.name} ${site.year}`],
              },
            ]}
          />

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
            rows={projects.map((p, i) => ({
              key: p.slug,
              label: `(${pad2(i + 1)}) ${p.year}`,
              values: (
                <Link href={`/work/${p.slug}`} className="underline-offset-4 hover:underline">
                  {p.title}
                </Link>
              ),
            }))}
          />

          <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-[52%_1fr] md:gap-5">
            <NameLogo title="" className="h-auto w-full max-w-[22rem] text-ink md:justify-self-end md:pr-6" />
            <p className="text-credit uppercase">
              ©{site.year} {site.name}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
