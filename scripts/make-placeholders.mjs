/**
 * Generates original, abstract "photo-like" placeholder images into /public/images/placeholder.
 * Nothing here is a real photo. Replace the files (or point frontmatter at new ones) whenever you like.
 *   npm run placeholders
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public/images/placeholder");
await mkdir(OUT, { recursive: true });

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

const palettes = [
  ["#F4C6CF", "#E89AAE", "#7A3B4C", "#FBEDEF"],
  ["#C9DDF0", "#8FB3D9", "#2F4A6B", "#EEF4FA"],
  ["#F6E7A8", "#E5C25A", "#6B5420", "#FCF7E4"],
  ["#CFE8D5", "#8CC29E", "#2E5A3C", "#EEF7F0"],
  ["#DCCFEA", "#AE97CF", "#47386A", "#F4F0F9"],
  ["#F7D2B8", "#E8A17A", "#7A4128", "#FCEFE6"],
  ["#E9E4DA", "#BFB5A3", "#3B3731", "#F7F4EE"],
];

const grain = (id, o = 0.18) => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="table" tableValues="0 ${o}"/></feComponentTransfer>
  </filter>`;

const scenes = {
  // soft fabric folds
  drape(w, h, p, r) {
    let folds = "";
    for (let i = 0; i < 9; i++) {
      const x = r() * w;
      const c = i % 2 ? p[1] : p[3];
      folds += `<path d="M${x} -20 C ${x + (r() - 0.5) * w * 0.6} ${h * 0.3}, ${x + (r() - 0.5) * w * 0.6} ${h * 0.7}, ${x + (r() - 0.5) * w * 0.4} ${h + 20}" stroke="${c}" stroke-width="${40 + r() * 120}" fill="none" opacity="0.55" stroke-linecap="round"/>`;
    }
    return `<rect width="${w}" height="${h}" fill="${p[0]}"/><g filter="url(#blur)">${folds}</g>`;
  },
  // figure silhouette against a backdrop
  figure(w, h, p, r) {
    const cx = w * (0.4 + r() * 0.2);
    const s = h / 1000;
    return `<rect width="${w}" height="${h}" fill="${p[3]}"/>
      <rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="${p[0]}"/>
      <circle cx="${w * 0.78}" cy="${h * 0.2}" r="${w * 0.14}" fill="${p[0]}" opacity="0.8"/>
      <g transform="translate(${cx} ${h * 0.12}) scale(${s})" fill="${p[2]}">
        <ellipse cx="0" cy="40" rx="34" ry="42"/>
        <path d="M-18 80 L18 80 L30 120 C 90 160, 110 320, 150 640 L -150 640 C -110 320, -90 160, -30 120 Z" fill="${p[1]}"/>
        <path d="M-30 120 C -60 200, -80 280, -96 360 L -80 364 C -60 290, -40 220, -20 150 Z"/>
        <path d="M30 120 C 60 200, 80 280, 96 360 L 80 364 C 60 290, 40 220, 20 150 Z"/>
        <rect x="-44" y="640" width="22" height="160" rx="8"/><rect x="22" y="640" width="22" height="160" rx="8"/>
      </g>
      <ellipse cx="${cx}" cy="${h * 0.93}" rx="${w * 0.22}" ry="${h * 0.02}" fill="${p[2]}" opacity="0.15"/>`;
  },
  // still life of blooms
  blooms(w, h, p, r) {
    let g = `<rect width="${w}" height="${h}" fill="${p[3]}"/>`;
    for (let i = 0; i < 7; i++) {
      const x = r() * w, y = r() * h, rad = 40 + r() * (w * 0.18);
      const c = p[i % 3];
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        g += `<ellipse cx="${x + Math.cos(a) * rad * 0.55}" cy="${y + Math.sin(a) * rad * 0.55}" rx="${rad * 0.5}" ry="${rad * 0.32}" transform="rotate(${(a * 180) / Math.PI} ${x + Math.cos(a) * rad * 0.55} ${y + Math.sin(a) * rad * 0.55})" fill="${c}" opacity="0.75"/>`;
      }
      g += `<circle cx="${x}" cy="${y}" r="${rad * 0.18}" fill="${p[2]}" opacity="0.8"/>`;
    }
    return g;
  },
  // architectural light and shadow
  arch(w, h, p, r) {
    let g = `<rect width="${w}" height="${h}" fill="${p[0]}"/>`;
    const n = 3 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      const x = (i / n) * w + w * 0.04;
      const bw = w / n - w * 0.08;
      g += `<path d="M${x} ${h} L${x} ${h * 0.35} A ${bw / 2} ${bw / 2} 0 0 1 ${x + bw} ${h * 0.35} L ${x + bw} ${h} Z" fill="${p[3]}"/>`;
      g += `<path d="M${x} ${h} L${x + bw * 0.6} ${h * 0.55} L${x + bw} ${h * 0.55} L${x + bw} ${h} Z" fill="${p[1]}" opacity="0.45"/>`;
    }
    return g;
  },
  // horizon / sea / sky
  horizon(w, h, p, r) {
    return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${p[3]}"/><stop offset="0.55" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient></defs>
      <rect width="${w}" height="${h}" fill="url(#sky)"/>
      <circle cx="${w * (0.3 + r() * 0.4)}" cy="${h * 0.48}" r="${Math.min(w, h) * 0.12}" fill="${p[3]}" opacity="0.9"/>
      <rect y="${h * 0.58}" width="${w}" height="${h * 0.42}" fill="${p[2]}" opacity="0.7"/>
      ${Array.from({ length: 14 }, (_, i) => `<rect x="${r() * w}" y="${h * 0.6 + i * h * 0.028}" width="${40 + r() * w * 0.4}" height="2" fill="${p[3]}" opacity="0.35"/>`).join("")}`;
  },
  // close-up texture: knit / weave
  weave(w, h, p, r) {
    let g = `<rect width="${w}" height="${h}" fill="${p[1]}"/>`;
    const step = 34 + Math.floor(r() * 18);
    for (let y = 0; y < h + step; y += step)
      for (let x = 0; x < w + step; x += step) {
        const v = (x / step + y / step) % 2;
        g += `<rect x="${x}" y="${y}" width="${step - 3}" height="${step - 3}" rx="${step / 3}" fill="${v ? p[0] : p[3]}" opacity="0.8" transform="rotate(${(r() - 0.5) * 8} ${x} ${y})"/>`;
      }
    return g;
  },
};

const sizes = { portrait: [1200, 1500], tall: [1000, 1400], square: [1200, 1200], landscape: [1600, 1100] };

const plan = [
  ["look-01", "figure", 0, "portrait"],
  ["look-02", "drape", 1, "portrait"],
  ["look-03", "blooms", 2, "square"],
  ["look-04", "arch", 6, "landscape"],
  ["look-05", "horizon", 1, "landscape"],
  ["look-06", "weave", 4, "square"],
  ["look-07", "figure", 3, "tall"],
  ["look-08", "drape", 5, "portrait"],
  ["look-09", "blooms", 0, "portrait"],
  ["look-10", "arch", 2, "tall"],
  ["look-11", "horizon", 5, "landscape"],
  ["look-12", "weave", 0, "square"],
  ["look-13", "figure", 4, "portrait"],
  ["look-14", "drape", 3, "landscape"],
  ["look-15", "blooms", 4, "square"],
  ["look-16", "figure", 6, "portrait"],
  ["portrait", "figure", 6, "portrait"],
];

for (const [name, scene, pal, size] of plan) {
  const [w, h] = sizes[size];
  const r = rng(name.split("").reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>${grain("grain")}<filter id="blur"><feGaussianBlur stdDeviation="${w / 60}"/></filter>
      <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/></radialGradient></defs>
    ${scenes[scene](w, h, palettes[pal], r)}
    <rect width="${w}" height="${h}" fill="url(#vig)"/>
    <rect width="${w}" height="${h}" filter="url(#grain)"/>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(OUT, `${name}.jpg`));
  console.log("✓", name);
}
