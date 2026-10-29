import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { LineArt } from "@/components/collage/LineArt";
import { Note } from "@/components/collage/Note";
import { Scribble } from "@/components/collage/Scribble";
import { TapedPhoto } from "@/components/collage/TapedPhoto";
import { CornerLabels } from "@/components/ui/CornerLabels";
import { Label } from "@/components/ui/Label";
import { MuseBoard } from "@/components/ui/MuseBoard";
import { PaletteStrip } from "@/components/ui/PaletteStrip";
import { ProcessGallery } from "@/components/ui/ProcessGallery";
import { ProjectPager } from "@/components/ui/ProjectPager";
import { getProject, getProjects } from "@/lib/projects";
import { formatCounter } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const data = await getProject((await params).slug);
  if (!data) return {};
  const { project } = data;
  return {
    title: project.title,
    description: project.summary,
    openGraph: { images: [{ url: project.cover, alt: project.coverAlt }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const data = await getProject((await params).slug);
  if (!data) notFound();
  const { project: p, index, total, prev, next } = data;

  /** Components available inside the project's MDX file. */
  const components = {
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="mb-6 mt-20 flex items-baseline gap-4 font-display text-4xl leading-none text-ink first:mt-0 md:text-5xl">
        <span
          aria-hidden="true"
          className="font-label text-label font-medium not-italic text-accent-ink before:content-[counter(section,decimal-leading-zero)] before:[counter-increment:section]"
        />
        {children}
      </h2>
    ),
    p: ({ children }: { children?: ReactNode }) => <p className="mb-5 max-w-[62ch] font-mono text-type">{children}</p>,
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="mb-6 flex max-w-[62ch] flex-col gap-3 font-mono text-type">{children}</ul>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="relative pl-7 before:absolute before:left-0 before:text-accent-ink before:content-['—']">{children}</li>
    ),
    a: ({ children, href }: { children?: ReactNode; href?: string }) => (
      <a href={href} className="text-accent-ink underline decoration-1 underline-offset-4">
        {children}
      </a>
    ),
    Note: ({ children }: { children?: ReactNode }) => (
      <div className="my-8 flex items-center gap-3 md:-ml-16">
        <Scribble variant="arrow" className="h-8 w-14 shrink-0" />
        <Note seed={String(children)} tone="marker" size="md">
          {children}
        </Note>
      </div>
    ),
    Palette: () => <PaletteStrip colors={p.palette} />,
    Process: () => <ProcessGallery items={p.galleryImages} title={p.title} />,
    Muse: () => <MuseBoard items={p.galleryImages} slug={p.slug} lineArt={p.lineArt} />,
  };

  return (
    <>
      <CornerLabels left={`project mood — ${p.tags[0] ?? "work"}`} right={formatCounter(index + 1, total)} />

      <header className="sheet-cols mt-8 gap-y-8">
        <div className="col-span-4 md:col-span-8">
          <h1 className="font-display text-mega">{p.title}</h1>
          {p.note && (
            <Note seed={p.slug + "-h"} rotate={-3} size="lg" tone="marker" className="ml-2 mt-4 md:ml-[12%]">
              {p.note}
            </Note>
          )}
        </div>
        <dl className="col-span-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 self-end font-mono text-type md:col-span-4">
          <Label as="dt">year</Label>
          <dd>{p.year}</dd>
          <Label as="dt">role</Label>
          <dd>{p.role}</dd>
          <Label as="dt">client</Label>
          <dd>{p.client}</dd>
          <Label as="dt">tags</Label>
          <dd>{p.tags.join(", ")}</dd>
        </dl>
      </header>

      <div className="sheet relative mt-14 md:mt-20">
        <TapedPhoto
          image={p.coverImage}
          alt={p.coverAlt}
          seed={`${p.slug}-hero`}
          rotate={-0.8}
          tape={[
            { position: "tl", color: "butter" },
            { position: "tr", color: "blush" },
          ]}
          torn={["bottom"]}
          aspectClassName="aspect-[4/3] md:aspect-[16/8]"
          sizes="(min-width: 1408px) 1344px, 100vw"
          priority
        />
        {p.lineArt && (
          <LineArt
            name={p.lineArt}
            strokeWidth={2}
            className="absolute -bottom-[8%] right-[6%] z-20 w-[38%] md:w-[24%]"
            delay={0.3}
          />
        )}
      </div>

      <article className="sheet-cols mt-20 [counter-reset:section] md:mt-28">
        <p className="col-span-4 mb-16 font-display text-3xl leading-tight md:col-span-8 md:col-start-3 md:text-4xl">
          {p.summary}
        </p>
        <div className="col-span-4 md:col-span-8 md:col-start-3">
          <MDXRemote source={p.body} components={components} />
        </div>
      </article>

      <ProjectPager prev={prev} next={next} index={index} total={total} />
    </>
  );
}
