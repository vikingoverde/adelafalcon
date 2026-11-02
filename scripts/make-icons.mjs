/**
 * Builds the browser-tab icon (app/icon.svg) and the home-screen icon (app/apple-icon.png)
 * from the hand-lettered name in components/ui/NameLogo.tsx: the black logo centred on paper.
 *   node scripts/make-icons.mjs
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const src = await readFile("components/ui/NameLogo.tsx", "utf8");
const viewBox = src.match(/const VIEWBOX = "([^"]+)"/)[1];
const path = src.match(/const PATH =\s*"([^"]+)"/)[1];
const [, , w, h] = viewBox.split(" ").map(Number);

function icon(size, pad, radius, bold = 0) {
  const scale = (size - pad * 2) / w;
  const y = (size - h * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#F1F0EC"/><path transform="translate(${pad} ${y.toFixed(2)}) scale(${scale.toFixed(5)})" fill="#111111" fill-rule="evenodd"${bold ? ` stroke="#111111" stroke-width="${bold}" stroke-linejoin="round"` : ""} d="${path}"/></svg>\n`;
}

// Tab icons are tiny (16–32px), so the letters are thickened a little to stay readable.
await writeFile("app/icon.svg", icon(64, 1.5, 10, 16));
await sharp(Buffer.from(icon(180, 12, 0, 6))).png().toFile("app/apple-icon.png");
console.log("✓ app/icon.svg, app/apple-icon.png");
