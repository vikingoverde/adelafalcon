/** Renders the paper-grain tile used by `.grain` in globals.css → public/grain.png */
import sharp from "sharp";

const size = 160;
const px = Buffer.alloc(size * size * 4);
let s = 42;
const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
for (let i = 0; i < size * size; i++) {
  const v = rnd();
  const dark = v > 0.5;
  px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = dark ? 30 : 255;
  px[i * 4 + 3] = Math.round(Math.abs(v - 0.5) * 2 * (dark ? 34 : 26));
}
await sharp(px, { raw: { width: size, height: size, channels: 4 } }).png({ compressionLevel: 9 }).toFile("public/grain.png");
console.log("✓ public/grain.png");
