import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { Credits } from "@/components/ui/Credits";
import { MediaBlock } from "@/components/ui/MediaBlock";
import { Photo } from "@/components/ui/Photo";
import { getProject, getProjects } from "@/lib/projects";
import { formatCounter, pad2, site } from "@/lib/site";

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

/** Full-width pieces inside the MDX body span both columns of the credits grid. */
const full = "md:col-span-2";

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const data = await getProject((await params).slug);
  if (!data) notFound();
  const { project: p, index, total, prev, next } = data;
  // Covers are always shown whole. Tall ones are capped at ~85% of the screen height (and centred),
  // so a portrait image never runs off the screen or gets cropped.
  const coverRatio = p.coverImage.width / p.coverImage.height;
  // Same for the process strip: landscape galleries (spreads, mockups) get a 4:3 frame.
  const galleryIsLandscape = (p.galleryImages[0]?.width ?? 0) > (p.galleryImages[0]?.height ?? 1);

  /**
   * Components available inside the project's MDX file. The body is a two-column credits
   * grid: `## Headings` sit right-aligned in the label column, everything else to the right.
   */
  const components = {
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="pt-4 text-micro uppercase md:col-start-1 md:pt-1 md:text-right">{children}</h2>
    ),
    p: ({ children }: { children?: ReactNode }) => <p className="max-w-[58ch] text-body font-normal md:col-start-2">{children}</p>,
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="flex max-w-[58ch] flex-col gap-2 text-body font-normal md:col-start-2">{children}</ul>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="relative pl-6 before:absolute before:left-0 before:content-['—']">{children}</li>
    ),
    a: ({ children, href }: { children?: ReactNode; href?: string }) => (
      <a href={href} className="underline underline-offset-4">
        {children}
      </a>
    ),
    Note: ({ children }: { children?: ReactNode }) => (
      <p className="py-4 text-credit uppercase md:col-start-2">“{children}”</p>
    ),
    /** A named media section from the frontmatter's `media` map, e.g. <Media name="tactile" />. */
    Media: ({ name }: { name?: string }) => {
      const block = name ? p.mediaBlocks[name] : undefined;
      if (!block) return null;
      return (
        <div className="pb-4 md:col-start-2">
          <MediaBlock block={block} projectTitle={p.title} />
        </div>
      );
    },
    Palette: () => (
      <div className={`${full} grid gap-3 md:grid-cols-[30%_minmax(0,1fr)] md:gap-x-5`}>
        <p className="pt-1 text-micro uppercase md:text-right">Palette</p>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {p.palette.map((c) => (
            <li key={c}>
              <span className="block aspect-[4/5]" style={{ background: c }} />
              <span className="mt-1.5 block text-micro uppercase">{c}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
    Process: () => (
      <div className={`${full} -mx-4 md:-mx-6`}>
        <ul
          tabIndex={0}
          aria-label={`${p.title} — process images, scroll sideways`}
          className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 md:gap-4 md:px-6"
        >
          {p.galleryImages.map((img, i) => (
            <li
              key={img.src + i}
              className={`shrink-0 snap-start ${galleryIsLandscape ? "w-[82vw] sm:w-[52vw] md:w-[34vw]" : "w-[62vw] sm:w-[36vw] md:w-[22vw]"}`}
            >
              <Photo
                image={img}
                alt={img.alt}
                aspectClassName={galleryIsLandscape ? "aspect-[4/3]" : "aspect-[3/4]"}
                sizes={galleryIsLandscape ? "(min-width: 768px) 34vw, 82vw" : "(min-width: 768px) 22vw, 62vw"}
              />
              <p className="mt-2 text-micro uppercase">
                ({pad2(i + 1)}) {img.caption}
              </p>
            </li>
          ))}
        </ul>
      </div>
    ),
    Muse: () => (
      <ul className={`${full} grid grid-cols-3 gap-3 md:ml-[30%] md:gap-4 md:pl-5`}>
        {p.galleryImages.slice(0, 3).map((img, i) => (
          <li key={img.src + i}>
            <Photo image={img} alt={img.alt} aspectClassName="aspect-square" sizes="(min-width: 768px) 20vw, 30vw" bw />
          </li>
        ))}
      </ul>
    ),
  };

  return (
    <article className="sheet pt-28 md:pt-36">
      <h1 className="sr-only">{p.title}</h1>

      {/* Title card */}
      <Credits axis="52%" mobileAxis="0%" rows={[{ values: [p.tagline ?? p.role, `${p.title} ${p.year}`] }]} />

      <Credits
        className="mt-12 md:mt-16"
        axis="22%"
        rows={[
          { label: "Project", values: formatCounter(index + 1, total) },
          { label: "Role", values: p.role.split(/,\s*/) },
          ...(p.client ? [{ label: "Client", values: p.client }] : []),
          { label: "Year", values: String(p.year) },
          { label: "Tags", values: p.tags },
        ]}
      />

      <div className="mt-16 md:mt-24">
        <div className="mx-auto" style={{ maxWidth: coverRatio < 1 ? `min(100%, calc(85vh * ${coverRatio.toFixed(4)}))` : undefined }}>
          <Photo image={p.coverImage} alt={p.coverAlt} sizes="(min-width: 1440px) 1392px, 100vw" priority />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-y-4 md:mt-24 md:grid-cols-[30%_minmax(0,1fr)] md:gap-x-5 md:gap-y-7">
        <p className="max-w-[40ch] text-credit uppercase md:col-start-2">{p.summary}</p>
        <MDXRemote source={p.body} components={components} />
      </div>

      {/* Next / previous, as the last lines of the credits */}
      <nav aria-label="More projects" className="mt-28 md:mt-36">
        <Credits
          axis="52%"
          rows={[
            {
              label: `(Previous) ${formatCounter(((index - 1 + total) % total) + 1, total)}`,
              values: (
                <Link href={`/work/${prev.slug}`} className="underline-offset-4 hover:underline">
                  {prev.title}
                </Link>
              ),
            },
            {
              label: `(Next) ${formatCounter(((index + 1) % total) + 1, total)}`,
              values: (
                <Link href={`/work/${next.slug}`} className="underline-offset-4 hover:underline">
                  {next.title}
                </Link>
              ),
            },
            { label: " ", values: `©${site.year} ${site.name}.` },
          ]}
        />
      </nav>
    </article>
  );
}
