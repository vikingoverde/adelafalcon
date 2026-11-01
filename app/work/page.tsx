import type { Metadata } from "next";
import Link from "next/link";
import { Credits } from "@/components/ui/Credits";
import { Photo } from "@/components/ui/Photo";
import { getProjects } from "@/lib/projects";
import { pad2 } from "@/lib/site";

export const metadata: Metadata = { title: "Work", description: "Selected projects." };

export default async function WorkPage() {
  const projects = await getProjects();
  const years = projects.map((p) => p.year);

  return (
    <div className="sheet pt-28 md:pt-36">
      <h1 className="sr-only">Work</h1>
      <Credits axis="52%" mobileAxis="0%" rows={[{ values: ["Selected work", `${Math.min(...years)}—${Math.max(...years)}`] }]} />

      {/*
        Cast list of projects. On desktop, hovering (or focusing) a title shows its cover
        in the empty space left of the axis; the first project shows when nothing is hovered.
      */}
      <ol className="work-list relative mt-20 grid content-start gap-y-8 md:mt-28 md:min-h-[34rem] md:gap-y-6">
        {projects.map((p, i) => (
          <li
            key={p.slug}
            data-default={i === 0 || undefined}
            className="grid grid-cols-[38%_minmax(0,1fr)] items-baseline gap-x-3 uppercase md:grid-cols-[52%_minmax(0,1fr)] md:gap-x-5"
          >
            <div className="text-right text-micro">
              <div className="mb-3 ml-auto w-full md:hidden">
                <Photo image={p.coverImage} alt="" aspectClassName="aspect-[4/5]" sizes="38vw" bw />
              </div>
              ({pad2(i + 1)}) {p.year}
              <br />
              {p.tags[0]}
            </div>
            <div>
              <Link
                href={`/work/${p.slug}`}
                className="work-link text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.05] underline-offset-[6px] hover:underline"
              >
                {p.title}
              </Link>
              <p className="mt-2 text-micro">
                {p.role}
                {p.client ? ` — ${p.client}` : ""}
              </p>
            </div>
            <div aria-hidden="true" className="work-preview pointer-events-none absolute left-0 top-0 hidden w-[24%] md:block">
              <Photo image={p.coverImage} alt="" aspectClassName="aspect-[4/5]" sizes="24vw" priority={i === 0} />
              <p className="mt-2 text-micro">
                ({pad2(i + 1)}) {p.tagline ?? p.title}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
