# Sketchbook portfolio

A personal creative portfolio that looks like a designer's sketchbook laid on a tidy editorial grid: polaroids, washi tape, torn paper, paint swatches and marker scribbles, sitting on a faint square grid with tiny green labels, a small adjective list on highlighter strips, flat prints with lots of white space, and a big fluorescent-green line-drawn tiger crawling across the photos.

Built with **Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS 3 · Framer Motion · MDX** (`next-mdx-remote/rsc`).

All names, copy, images and drawings are original placeholders.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

`npm run images` (which runs automatically before `dev` and `build`) scans `/public/images` and writes `lib/image-manifest.json`, which holds each image's size and a tiny blur placeholder for `next/image`.

---

## Folder structure

```
app/                     routes (RSC by default)
  layout.tsx             fonts, paper backdrop, header, cursor, motion provider
  template.tsx           paper-slide page transition
  page.tsx               home / hero collage
  work/page.tsx          work index (moodboard spreads)
  work/[slug]/page.tsx   project detail from MDX (generateStaticParams)
  about/ contact/
components/collage/      reusable collage pieces
  Polaroid  TapeStrip  TapedPhoto  TornPaper  Swatch  Scribble  LineArt
  Note (handwritten)  SketchCard  CollageItem (+ CollageBoard)
  line-art/drawings.ts   the SVG line drawings (swap these)
components/ui/           layout + page-level pieces (labels, header, cursor, spreads, pager…)
content/projects/*.mdx   one file per project
lib/                     site copy, project loader, image manifest, seeded randomness, hooks
public/images/           your images (placeholders live in public/images/placeholder)
scripts/                 image manifest, placeholder and grain generators
```

---

## Adding a project

Create `content/projects/my-project.mdx`. The file name becomes the URL (`/work/my-project`).

```mdx
---
title: My Project
year: 2026
role: Concept, styling
client: Someone nice
order: 4                        # optional: lower comes first (default: newest year first)
summary: One typewriter paragraph shown on the work index and under the title.
note: a handwritten margin note  # optional
lineArt: tigerFull               # optional: tiger | tigerFull | cloud | flower | croquis | blossom | swirl
palette: ["#F4C6CF", "#7A3B4C", "#A6E22E"]
tags: [capsule, print]
cover: /images/my-project/cover.jpg
coverAlt: "Describe the cover image"
gallery:
  - src: /images/my-project/01.jpg
    alt: "Describe the image"
    caption: "toile, week 2"      # optional, shown handwritten
  - /images/my-project/02.jpg     # short form (alt is generated, so prefer the long form)
---

## Concept
Body text is typewriter style. Section headings get numbered automatically.

<Note>a handwritten aside with a marker arrow</Note>

## Colour & Muse
<Palette />   {/* swatch strip from `palette` */}
<Muse />      {/* mini collage from the first 3 gallery images */}

## Process
<Process />   {/* horizontal strip of taped gallery images */}

## Outcomes
- bullet points work as normal
```

Frontmatter is validated at build time in `lib/projects.ts`. A missing field, a malformed hex colour or an unknown `lineArt` name stops the build with a message naming the file. The work index, page counters ("02 / 09") and previous/next links update by themselves.

The MDX is compiled with `next-mdx-remote` v6, which blocks JavaScript expressions in content by default. Use the components above, not `{…}` expressions.

---

## Swapping images

1. Put your files anywhere under `public/images/` (jpg, png, webp or avif).
2. Point the frontmatter (or the `ph(...)` / `getImage(...)` calls in `app/page.tsx` and `app/about/page.tsx`) at them, e.g. `/images/my-project/cover.jpg`.
3. Run `npm run images`, or just restart `dev`. Sizes and blur placeholders are generated for you.

Remote images also work: add the host to `images.remotePatterns` in `next.config.ts`. They get a neutral paper-coloured blur instead of a generated one.

To regenerate the abstract placeholders, run `npm run placeholders`.

## Swapping colours, fonts and line art

- **Colours** live in `tailwind.config.ts`:
  - `paper` (#F1F0EC) is the light bone-grey background; `paper.deep` and `paper.white` are the darker and lighter tints used under images and on cards.
  - `accent` (#8ACE00) is the fluorescent "brat" green for line art, tiger stripes, the cursor, tape, and the highlight behind the adjectives and poster titles. It is only 1.7:1 on the paper colour, so it is never used for text on paper. Black text on top of it is fine (8.7:1).
  - `accent.ink` (#4B7500) is the text-safe deep green for labels, links, counters and focus rings (4.8:1 on paper).
  - `marker` is the pink of the scrapbook notes.
  - `pastel.*` is reserved for collage pieces.

  `LineArt` and `Scribble` draw with `currentColor`, so changing the tokens recolours every drawing. Tape colours are in `tapeColors` in `TapeStrip.tsx`.
- **Fonts** are set in `app/layout.tsx` with `next/font/google`:
  - Instrument Serif for display
  - IBM Plex Mono for body
  - Caveat for handwriting
  - Inter for the tiny labels

  Swap any import and keep the `variable` name.
- **Line art** is in `components/collage/line-art/drawings.ts`. Export your drawing as SVG, then paste each path's `d` into a new entry with the artboard's `viewBox`.
  - Outlines are plain strokes. They draw in order, and the stroke weight stays constant at any size.
  - Solid shapes, like the tiger's brush stripes, get `fill: true` and fade in when their turn comes. The `stripe(x, y, length, angle, width)` helper makes tapered stripes.
  - Any new entry can be used from frontmatter straight away.
- **Copy** (name, tagline, adjectives, email, socials) is in `lib/site.ts`.
- **Paper grain** is `public/grain.png`. Regenerate it with `node scripts/make-grain.mjs`, or replace it with any tileable texture.

## Collage building blocks

| Component | What it does |
| --- | --- |
| `<Print image alt label />` | Flat, unframed print for the clean editorial look |
| `<PosterCard title images />`, `<ScriptCard lines />` | Small zine cover and a handwritten lettering card |
| `<Polaroid image alt caption seed tape sizes />` | White-bordered print with a handwritten caption and a seeded −6°…6° tilt |
| `<TapedPhoto image alt seed tape torn />` | Loose photo with tape and optional torn edges |
| `<TapeStrip position color />` | Semi-transparent washi tape with torn ends. Positions: `tl tr bl br top bottom` |
| `<TornPaper edges seed>` | Jagged SVG `clip-path` (objectBoundingBox) with a drop shadow |
| `<Swatch color />`, `<SwatchRow colors />` | Irregular paint dabs |
| `<Scribble variant />` | Marker strokes that draw in on scroll, or on hover with `trigger="manual"` |
| `<LineArt name />` | Thin single-colour illustration that draws in on scroll |
| `<Note>` | Handwritten, tilted annotation |
| `<CollageBoard>` + `<CollageItem x y w depth draggable>` | Absolute placement on desktop, single-column stack on mobile, plus parallax, drag-and-spring-back and "placed on the table" entry |

Rotations come from a hash of a `seed` string, so they are random-looking but identical on the server and the client (no hydration mismatches).

## The home page

The hero is one editorial "slide": corner labels, the name, the adjective list, a few flat prints, and the big `tigerFull` drawing with small `swirl` and `blossom` ornaments. On desktop everything is placed by percentage on a 16:10 board; edit the `x / y / w` props in `app/page.tsx` to move things. Below it, "From the sketchbook" holds the messier scrapbook collage (polaroids, tape, torn paper, swatches). Both collapse into a single column on mobile.

The grid behind the page has square cells. Its vertical lines line up with the 12 columns, and the row height matches the column pitch (`.paper-grid` in `globals.css`).

## Motion and accessibility notes

- Line drawings animate with pure CSS (`pathLength=1` and `stroke-dashoffset`), triggered by an IntersectionObserver. Under `prefers-reduced-motion` they appear fully drawn.
- Framer Motion is loaded through `LazyMotion`, so its feature bundle is code-split. Under `prefers-reduced-motion`, `MotionConfig reducedMotion="user"` skips transform animations, and drag and parallax are switched off explicitly. The page wipe is skipped too.
- The custom cursor only appears on fine-pointer devices. Any element with `data-cursor="view"` (or any other text) turns it into a label.
- Above-the-fold collage pieces use `eager` so they paint right away instead of fading in, which keeps LCP good.
- Brat green is too light for text on paper, so labels, links and focus rings use `accent.ink` (#4B7500, 4.8:1). Wherever the bright green carries text (adjectives, the poster title, the lettering card), the text is black on a green background.
- Project cards are a single stretched link. The visible focus ring sits on the whole spread, and the hover spread-out also triggers on keyboard focus.
