/**
 * Site-wide copy and settings. Everything here is placeholder content — edit freely.
 */
export const site = {
  name: "Adela Falcon",
  firstName: "Adela",
  lastName: "Falcon",
  role: "fashion & visual designer",
  year: 2026,
  tagline: "makes clothes, keeps scraps, draws tigers on everything.",
  description:
    "Portfolio of Adela Falcon — a fashion and visual designer working between sketchbook, cutting table and screen.",
  email: "hello@example.com",
  url: "https://example.com",
  adjectives: ["creative", "curious", "thoughtful", "bold", "playful", "empathetic", "confident", "tactile"],
  socials: [
    { label: "instagram", href: "https://instagram.com/" },
    { label: "are.na", href: "https://are.na/" },
    { label: "linkedin", href: "https://linkedin.com/" },
    { label: "read.cv", href: "https://read.cv/" },
  ],
} as const;

/** Top-level pages, in counter order ("01 / 04"). */
export const pages = [
  { href: "/", label: "index" },
  { href: "/work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

export function pageCounter(href: (typeof pages)[number]["href"]) {
  const i = pages.findIndex((p) => p.href === href);
  return formatCounter(i + 1, pages.length);
}

export function formatCounter(n: number, total: number) {
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${pad(n)} / ${pad(total)}`;
}
