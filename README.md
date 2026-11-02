# Adela Falcon — portfolio

A minimal portfolio set like a film's end credits: one red, monospace capitals, small role labels right-aligned against an axis with names to their right, and a home page "reel" of black & white prints that grow, warp and turn to colour as you hover them. The menu sits in the corners.

Built with **Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS 3 · MDX** (`next-mdx-remote/rsc`). There is almost no client-side JavaScript: the hover effects are CSS.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

`npm run images` runs automatically before `dev` and `build`. It scans `/public/images` and writes `lib/image-manifest.json` with each image's size and a tiny blur placeholder for `next/image`.

---

## Where things live

| To change… | Edit |
| --- | --- |
| Name, role, tagline, email, city, socials, services, tools, adjectives | `lib/site.ts` |
| The colour (one red) and the background | `tailwind.config.ts` → `colors` |
| The typeface | `app/layout.tsx` (IBM Plex Mono via `next/font`) |
| A project's text, colours, photos | `content/projects/<name>.mdx` |
| About page bio and portrait | `app/about/page.tsx` |
| Home page credits block | `app/page.tsx` |
| The hand-lettered name | `components/ui/NameLogo.tsx` (traced from `public/brand/name-original.png`) |
| Tab icon and home-screen icon | generated from the logo by `node scripts/make-icons.mjs` → `app/icon.svg`, `app/apple-icon.png` |

```
app/                     routes
  layout.tsx             font, corner menu, footer
  template.tsx           fade between pages
  page.tsx               home: image reel + credits
  work/page.tsx          work index: projects as a cast list with hover previews
  work/[slug]/page.tsx   project page from MDX (generateStaticParams)
  about/ contact/
components/ui/
  SiteHeader.tsx         corner menu (name · (section) · links)
  SiteFooter.tsx         bottom corners
  Credits.tsx            the end-credits block
  ImageStrip.tsx         the home page reel (+ WheelScroll.tsx so a mouse wheel scrolls it)
  Photo.tsx              next/image with blur placeholder, optional black & white
  NameLogo.tsx           the hand-lettered name as an SVG
content/projects/*.mdx   one file per project
lib/                     site copy, project loader, image manifest
public/images/           your images (placeholders in public/images/placeholder)
scripts/                 image manifest + placeholder generator
```

---

## Adding a project

Create `content/projects/my-project.mdx`. The file name becomes the address (`/work/my-project`).

```mdx
---
title: My Project
year: 2026
role: Concept, styling          # commas split it into lines in the credits
client: Someone nice
order: 4                        # optional: lower comes first (default: newest year first)
tagline: A one-line title card  # optional, shown top-right like a film title
summary: A short paragraph for the work index and the top of the project page.
palette: ["#F4C6CF", "#7A3B4C", "#E8333A"]
tags: [capsule, print]
cover: /images/my-project/cover.jpg
coverAlt: "Describe the cover image"
gallery:
  - src: /images/my-project/01.jpg
    alt: "Describe the image"
    caption: "toile, week 2"     # shown in the home reel and the process strip
---

## Concept
Each `##` heading becomes a small label on the left of the axis; the text sits to its right.

<Note>a pull quote, set large in capitals</Note>

## Colour & Muse
<Palette />   {/* colour blocks from `palette` */}
<Muse />      {/* three black & white images from the gallery */}

## Process
<Process />   {/* sideways-scrolling strip of the gallery images */}

## Outcomes
- bullet points work as normal
```

The frontmatter is checked at build time in `lib/projects.ts`: a missing field or a malformed colour stops the build with a message naming the file. The home reel, the work list, the credits and the previous/next links all update by themselves. Every cover and gallery image of every project appears in the home reel, in project order.

---

## Media sections (GIFs, videos, a flip-book)

A project can give each section its own media with a `media` map in the frontmatter and `<Media name="…" />` in the body (see `content/projects/el-universo-de-rosalia.mdx`):

```yaml
media:
  preludio: { layout: single, items: [{ src: /images/rosalia/box-opening.gif, alt: "…" }] }
  tactile:  { layout: row, items: [{ src: …, alt: …, caption: "Flamenco textile" }, …] }
  sound:    { layout: feature, items: [cover, interior, interior, interior] }
  visual:   { layout: video, youtube: https://www.youtube.com/watch?v=… }
  coda:     { layout: book, items: [page1, page2, …] }   # or `placeholders: 12` for blank pages
```

- `single` one large image, GIF or `.mp4`/`.webm` (videos autoplay muted and loop) · `row` images side by side · `feature` first image large, the rest beside it · `video` a YouTube video that only loads when played · `book` a flip-book on desktop (click a page, use the buttons or ← →) and a swipeable slider on phones.
- An item with no `src` shows as a labelled "to come" frame, so the layout can go live before the images do.

## Swapping images

1. Put your files under `public/images/` (jpg, png, webp or avif), e.g. `public/images/my-project/`.
2. Point the frontmatter (or `getImage(ph("portrait"))` in `app/about/page.tsx`) at them, e.g. `/images/my-project/cover.jpg` — without `public`.
3. Restart `dev` (or run `npm run images`). Sizes and blur placeholders are generated for you; on Vercel this happens on every build.

Images are shown black & white in the home reel, the work previews and the Muse grid, and in colour when hovered and on project pages. To change that, remove `bw` from a `<Photo>` or the `filter` rule in `.strip-img` (`app/globals.css`).

## Colour

There is one colour, `red` (#CC2920), for all text and lines, on `paper` (#F1F0EC). The only exception is the hand-lettered name, which is `ink` (#111111, black). The red is 4.7:1 against the paper, so even the 10px labels stay readable. Change both in `tailwind.config.ts`.

## How the pieces work

- **Credits** (`components/ui/Credits.tsx`): `rows` of `{ label, values }`. `axis` sets where labels end and names begin (e.g. `"22%"`, `"52%"`); stacking blocks with different axes gives the staggered rhythm of a credits card.
- **The reel** (`components/ui/ImageStrip.tsx` + `.strip` rules in `globals.css`): on desktop the hovered or keyboard-focused print grows, warps (a CSS `clip-path` that animates between a flat and a "pincushion" polygon), turns to colour and shows its caption; when nothing is hovered, the second print is the large one. On phones it is a swipeable row with captions.
- **Work previews**: hovering a title on `/work` shows that project's cover on the left; the first one shows by default.
- **Motion**: page fades and hover transitions are CSS and switch off under `prefers-reduced-motion`.
- **Accessibility**: one `h1` per page, labelled menus, a skip link, alt text from the frontmatter, visible focus (caption underline in the reel), and colour contrast ≥ 4.5:1.
