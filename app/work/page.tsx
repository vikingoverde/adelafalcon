import type { Metadata } from "next";
import { Note } from "@/components/collage/Note";
import { CornerLabels } from "@/components/ui/CornerLabels";
import { ProjectSpread } from "@/components/ui/ProjectSpread";
import { getProjects, toCard } from "@/lib/projects";
import { pageCounter } from "@/lib/site";

export const metadata: Metadata = { title: "Work", description: "Selected projects, laid out as moodboard spreads." };

export default async function WorkPage() {
  const projects = await getProjects();
  const years = projects.map((p) => p.year);

  return (
    <>
      <CornerLabels left="selected work" right={pageCounter("/work")} />
      <header className="sheet-cols mt-8 items-end gap-y-4">
        <h1 className="col-span-4 font-display text-mega md:col-span-8">Work</h1>
        <div className="col-span-4 pb-4 md:col-span-4">
          <Note seed="work-intro" rotate={-4} size="md">
            {Math.min(...years)} — {Math.max(...years)}, a few favourites
          </Note>
          <p className="mt-4 max-w-[40ch] font-mono text-type text-ink-soft">
            {projects.length} projects. each one is a spread from the sketchbook: the photo that started it, the
            colours, and the note I wrote in the margin.
          </p>
        </div>
      </header>

      <ol className="mt-8 divide-y divide-ink/10">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <ProjectSpread project={toCard(p)} index={i} total={projects.length} />
          </li>
        ))}
      </ol>
    </>
  );
}
