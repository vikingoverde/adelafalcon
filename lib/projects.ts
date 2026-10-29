import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { getImage, type ImageData } from "./images";
import { drawings, type LineArtName } from "@/components/collage/line-art/drawings";

const DIR = path.join(process.cwd(), "content/projects");

export type GalleryItem = { src: string; alt: string; caption?: string };

/** Frontmatter as written in content/projects/*.mdx */
export type ProjectFrontmatter = {
  title: string;
  year: number;
  role: string;
  client: string;
  palette: string[];
  cover: string;
  coverAlt: string;
  gallery: GalleryItem[];
  tags: string[];
  /** Typewriter paragraph shown on the work index. */
  summary: string;
  /** Handwritten margin note. */
  note?: string;
  /** Which line drawing to draw over the cover. */
  lineArt?: LineArtName;
  /** Lower comes first. Falls back to newest year first. */
  order?: number;
};

export type Project = ProjectFrontmatter & {
  slug: string;
  body: string;
  coverImage: ImageData;
  galleryImages: (ImageData & { alt: string; caption?: string })[];
};

const LINE_ARTS = Object.keys(drawings) as LineArtName[];
const HEX = /^#(?:[0-9a-f]{3}){1,2}$/i;

function fail(file: string, msg: string): never {
  throw new Error(`[content/projects/${file}] ${msg}`);
}

/** Validates frontmatter at build time so typos fail loudly instead of rendering blanks. */
function parseFrontmatter(file: string, data: Record<string, unknown>): ProjectFrontmatter {
  const str = (k: string, optional = false) => {
    const v = data[k];
    if (v === undefined && optional) return undefined;
    if (typeof v !== "string" || !v.trim()) fail(file, `"${k}" must be a non-empty string`);
    return v;
  };
  const list = (k: string) => {
    const v = data[k];
    if (!Array.isArray(v)) fail(file, `"${k}" must be a list`);
    return v as unknown[];
  };

  const year = Number(data.year);
  if (!Number.isInteger(year)) fail(file, `"year" must be a number`);

  const palette = list("palette").map(String);
  for (const c of palette) if (!HEX.test(c)) fail(file, `palette colour "${c}" is not a hex value`);

  const title = str("title")!;
  const gallery = list("gallery").map((item, i): GalleryItem => {
    if (typeof item === "string") return { src: item, alt: `${title} — process image ${i + 1}` };
    const o = item as Record<string, unknown>;
    if (typeof o.src !== "string") fail(file, `gallery[${i}].src is missing`);
    return {
      src: o.src,
      alt: typeof o.alt === "string" ? o.alt : `${title} — process image ${i + 1}`,
      caption: typeof o.caption === "string" ? o.caption : undefined,
    };
  });

  const lineArt = str("lineArt", true);
  if (lineArt && !LINE_ARTS.includes(lineArt as LineArtName))
    fail(file, `"lineArt" must be one of ${LINE_ARTS.join(", ")}`);

  return {
    title,
    year,
    role: str("role")!,
    client: str("client")!,
    palette,
    cover: str("cover")!,
    coverAlt: str("coverAlt", true) ?? `${title} — cover image`,
    gallery,
    tags: list("tags").map(String),
    summary: str("summary")!,
    note: str("note", true),
    lineArt: lineArt as LineArtName | undefined,
    order: typeof data.order === "number" ? data.order : undefined,
  };
}

export const getProjects = cache(async (): Promise<Project[]> => {
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".mdx"));
  const projects = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);
      const fm = parseFrontmatter(file, data);
      return {
        ...fm,
        slug: file.replace(/\.mdx$/, ""),
        body: content,
        coverImage: getImage(fm.cover),
        galleryImages: fm.gallery.map((g) => ({ ...getImage(g.src), alt: g.alt, caption: g.caption })),
      } satisfies Project;
    }),
  );
  return projects.sort(
    (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || b.year - a.year || a.title.localeCompare(b.title),
  );
});

export async function getProject(slug: string) {
  const all = await getProjects();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    project: all[index]!,
    index,
    total: all.length,
    prev: all[(index - 1 + all.length) % all.length]!,
    next: all[(index + 1) % all.length]!,
  };
}

/** The serialisable subset of a project that client components need (no MDX body). */
export type ProjectCard = Pick<
  Project,
  "slug" | "title" | "year" | "role" | "client" | "palette" | "summary" | "note" | "lineArt" | "tags" | "coverAlt"
> & {
  coverImage: ImageData;
  galleryImages: Project["galleryImages"];
};

export function toCard(p: Project, galleryCount = 3): ProjectCard {
  return {
    slug: p.slug,
    title: p.title,
    year: p.year,
    role: p.role,
    client: p.client,
    palette: p.palette,
    summary: p.summary,
    note: p.note,
    lineArt: p.lineArt,
    tags: p.tags,
    coverAlt: p.coverAlt,
    coverImage: p.coverImage,
    galleryImages: p.galleryImages.slice(0, galleryCount),
  };
}
