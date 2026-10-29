import "server-only";
import manifest from "./image-manifest.json";

export type ImageData = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

type Manifest = Record<string, { width: number; height: number; blurDataURL: string }>;
const entries = manifest as Manifest;

/** Neutral paper-coloured fallback blur for images not in the manifest (e.g. remote URLs). */
const PAPER_BLUR =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="5"><rect width="4" height="5" fill="#E5E4DF"/></svg>');

/**
 * Server-side only (keeps the manifest out of client bundles): resolve images in server
 * components and pass the resulting `ImageData` down to collage pieces.
 *
 * Look up an image by its public path (e.g. "/images/placeholder/look-01.jpg").
 * Local images get their real size and a generated blur placeholder from lib/image-manifest.json
 * (rebuilt by `npm run images`, which runs automatically before dev/build).
 */
export function getImage(src: string): ImageData {
  const hit = entries[src];
  if (hit) return { src, ...hit };
  if (process.env.NODE_ENV !== "production" && src.startsWith("/")) {
    console.warn(`[images] "${src}" is not in lib/image-manifest.json — run \`npm run images\`.`);
  }
  return { src, width: 1200, height: 1500, blurDataURL: PAPER_BLUR };
}

/** Shorthand for the bundled placeholders: ph("look-01") → "/images/placeholder/look-01.jpg" */
export const ph = (name: string) => `/images/placeholder/${name}.jpg`;
