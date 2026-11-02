import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { getImage, type ImageData } from "./images";

const DIR = path.join(process.cwd(), "content/projects");

export type GalleryItem = { src: string; alt: string; caption?: string };

/**
 * Per-section media for a project page, placed in the MDX with `<Media name="…" />`.
 * - single:  one large image, GIF or video (e.g. the box opening)
 * - row:     a row of images (e.g. three references)
 * - feature: the first image large, the rest beside it (e.g. a disc cover + interiors)
 * - video:   a YouTube video (`youtube` = the id or full link)
 * - book:    a flip-book of pages (desktop) / page slider (phone)
 * Items without `src` render as labelled "to come" frames; `placeholders: n` adds n blank ones.
 */
export type MediaLayout = "single" | "row" | "feature" | "video" | "book";
export type MediaItemInput = { src?: string; alt?: string; caption?: string };
export type MediaBlockInput = {
  layout: MediaLayout;
  items?: MediaItemInput[];
  placeholders?: number;
  youtube?: string;
  title?: string;
  caption?: string;
  /** row layout: number of columns (2–4, default 3). */
  columns?: number;
  /** Frame shape for row items, e.g. "2/3" (default 3/4). */
  ratio?: string;
};
export type ResolvedMediaItem =
  | { kind: "image"; image: ImageData; alt: string; caption?: string }
  | { kind: "video"; src: string; alt: string; caption?: string }
  | { kind: "placeholder"; caption?: string };
export type ResolvedMediaBlock = Omit<MediaBlockInput, "items" | "placeholders"> & { items: ResolvedMediaItem[] };

/** Frontmatter as written in content/projects/*.mdx */
export type ProjectFrontmatter = {
  title: string;
  year: number;
  role: string;
  /** Optional: leave out and the "Client" credit is hidden. */
  client?: string;
  palette: string[];
  cover: string;
  coverAlt: string;
  gallery: GalleryItem[];
  tags: string[];
  /** Short paragraph shown on the work index and at the top of the project page. */
  summary: string;
  /** One-line tagline for the project's credits "title card", e.g. "A soft but ferocious capsule". */
  tagline?: string;
  /** Lower comes first. Falls back to newest year first. */
  order?: number;
  /** Optional per-section media, keyed by name (see MediaBlockInput). */
  media?: Record<string, MediaBlockInput>;
};

export type Project = ProjectFrontmatter & {
  slug: string;
  body: string;
  coverImage: ImageData;
  galleryImages: (ImageData & { alt: string; caption?: string })[];
  mediaBlocks: Record<string, ResolvedMediaBlock>;
};

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

  const LAYOUTS: MediaLayout[] = ["single", "row", "feature", "video", "book"];
  let media: Record<string, MediaBlockInput> | undefined;
  if (data.media !== undefined) {
    if (typeof data.media !== "object" || data.media === null) fail(file, `"media" must be a map of named sections`);
    media = {};
    for (const [name, raw] of Object.entries(data.media as Record<string, unknown>)) {
      const b = raw as Record<string, unknown>;
      if (!LAYOUTS.includes(b.layout as MediaLayout))
        fail(file, `media.${name}.layout must be one of ${LAYOUTS.join(", ")}`);
      if (b.layout === "video" && typeof b.youtube !== "string") fail(file, `media.${name} needs a "youtube" link or id`);
      media[name] = {
        layout: b.layout as MediaLayout,
        items: Array.isArray(b.items) ? (b.items as MediaItemInput[]) : [],
        placeholders: typeof b.placeholders === "number" ? b.placeholders : 0,
        youtube: typeof b.youtube === "string" ? b.youtube : undefined,
        title: typeof b.title === "string" ? b.title : undefined,
        caption: typeof b.caption === "string" ? b.caption : undefined,
        columns: typeof b.columns === "number" ? b.columns : undefined,
        ratio: typeof b.ratio === "string" ? b.ratio : undefined,
      };
    }
  }

  return {
    title,
    year,
    role: str("role")!,
    client: str("client", true),
    palette,
    cover: str("cover")!,
    coverAlt: str("coverAlt", true) ?? `${title} — cover image`,
    gallery,
    tags: list("tags").map(String),
    summary: str("summary")!,
    tagline: str("tagline", true),
    order: typeof data.order === "number" ? data.order : undefined,
    media,
  };
}

const VIDEO_EXT = /\.(mp4|webm|mov)$/i;

function resolveMedia(title: string, media: Record<string, MediaBlockInput> | undefined) {
  const out: Record<string, ResolvedMediaBlock> = {};
  for (const [name, b] of Object.entries(media ?? {})) {
    const items: ResolvedMediaItem[] = (b.items ?? []).map((it, i) => {
      if (!it.src) return { kind: "placeholder", caption: it.caption };
      const alt = it.alt ?? `${title} — ${name} ${i + 1}`;
      return VIDEO_EXT.test(it.src)
        ? { kind: "video", src: it.src, alt, caption: it.caption }
        : { kind: "image", image: getImage(it.src), alt, caption: it.caption };
    });
    for (let i = 0; i < (b.placeholders ?? 0); i++) items.push({ kind: "placeholder" });
    const { items: _items, placeholders: _p, ...rest } = b;
    void _items;
    void _p;
    out[name] = { ...rest, items };
  }
  return out;
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
        mediaBlocks: resolveMedia(fm.title, fm.media),
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
  "slug" | "title" | "year" | "role" | "client" | "palette" | "summary" | "tagline" | "tags" | "coverAlt"
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
    tagline: p.tagline,
    tags: p.tags,
    coverAlt: p.coverAlt,
    coverImage: p.coverImage,
    galleryImages: p.galleryImages.slice(0, galleryCount),
  };
}
