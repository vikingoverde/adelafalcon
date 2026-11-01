/**
 * Site-wide copy and settings. Most of this is placeholder content — edit freely.
 */
export const site = {
  name: "Adela Falcon",
  /** Shown in the footer, the home page corner, the About title and the browser tab. */
  role: "Design & art direction",
  /** The "Discipline" lines in the credits (Home and About). */
  disciplines: ["Design", "Art direction", "Content"],
  year: 2026,
  /** One-line intro, used in the home page credits and meta description. */
  tagline: "Clothes, prints and the visual worlds around them.",
  description:
    "Portfolio of Adela Falcon — design and art direction, between sketchbook, studio and screen.",
  email: "hello@example.com",
  url: "https://example.com",
  basedIn: "Your city",
  adjectives: ["creative", "curious", "thoughtful", "bold", "playful", "empathetic", "confident", "tactile"],
  services: ["Capsule & collection design", "Pattern cutting & toiles", "Textile & print design", "Art direction & styling", "Visual identity"],
  tools: ["Pencil, marker, scissors", "Clo3D", "Illustrator & Photoshop", "Figma", "A very old sewing machine"],
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Are.na", href: "https://are.na/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ],
} as const;

/** Main menu (top-right corner). The home page is reached through the name, top-left. */
export const nav = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** "03 / 09" style counters. */
export function formatCounter(n: number, total: number) {
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${pad(n)} / ${pad(total)}`;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
