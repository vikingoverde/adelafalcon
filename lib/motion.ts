/** Shared motion tokens so everything moves with the same hand. */
export const ease = {
  /** A paper sheet settling onto a table. */
  settle: [0.22, 1, 0.36, 1] as const,
  /** Fast in, soft out — used for the page wipe. */
  wipe: [0.7, 0, 0.2, 1] as const,
};

export const stagger = (i: number, base = 0.08, start = 0.05) => start + i * base;
