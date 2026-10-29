/**
 * Scans /public/images and writes lib/image-manifest.json with each image's
 * intrinsic size and a tiny base64 blur placeholder for next/image.
 * Runs automatically before `dev` and `build`. Run manually with `npm run images`.
 */
import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public");
const DIR = path.join(ROOT, "images");
const OUT = path.join(process.cwd(), "lib/image-manifest.json");
const EXT = /\.(jpe?g|png|webp|avif)$/i;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat().filter((f) => EXT.test(f));
}

const manifest = {};
for (const file of (await walk(DIR)).sort()) {
  const img = sharp(file);
  const { width, height } = await img.metadata();
  const blur = await img.clone().resize(12, null, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer();
  const key = "/" + path.relative(ROOT, file).split(path.sep).join("/");
  manifest[key] = { width, height, blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}` };
}
await writeFile(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(`image manifest: ${Object.keys(manifest).length} images → lib/image-manifest.json`);
