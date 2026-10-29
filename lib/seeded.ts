/**
 * Deterministic "randomness" so collage rotations are identical on server and client
 * (no hydration mismatch) and stable between visits.
 */
export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A float in [min, max) derived from `seed`. */
export function seededRange(seed: string, min: number, max: number): number {
  return min + (hash(seed) / 2 ** 32) * (max - min);
}

/** Collage rotation in degrees, -6° … 6° by default, rounded to 0.1°. */
export function seededRotation(seed: string, max = 6): number {
  return Math.round(seededRange(seed, -max, max) * 10) / 10;
}

export function seededPick<T>(seed: string, items: readonly T[]): T {
  return items[hash(seed) % items.length] as T;
}
