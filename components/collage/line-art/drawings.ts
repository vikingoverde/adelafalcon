/**
 * Original single-line drawings used by <LineArt>.
 *
 * To swap in your own: draw on a canvas of any size (Figma, Illustrator, Procreate → SVG),
 * export with *strokes only* (no fills), and paste each <path d="…"> here with the
 * artboard's viewBox. Each path animates in sequence, so order them in drawing order.
 */
export type Stroke = {
  d: string;
  transform?: string;
  /** Filled shape (e.g. a brush stripe) instead of a line. Fades in after the outline draws. */
  fill?: boolean;
};
export type Drawing = { viewBox: string; label: string; strokes: Stroke[] };

const mirror = (d: string, width: number) =>
  // Mirrors absolute coordinates horizontally (x' = width - x). Only for paths written with
  // absolute M/C/L commands and comma-free "x y" pairs, like the ones below.
  d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${width - Number(x)} ${y}`);

/**
 * A tapered brush stripe: a thin lens from (x, y) heading `angle`° for `len` units,
 * `w` wide at its fattest, bending by `bend` (−1…1). Used for tiger stripes.
 */
function stripe(x: number, y: number, len: number, angle: number, w: number, bend = 0.25): Stroke {
  const a = (angle * Math.PI) / 180;
  const ux = Math.cos(a), uy = Math.sin(a);
  const nx = -uy, ny = ux;
  const ex = x + ux * len, ey = y + uy * len;
  const mx = x + ux * len * 0.45 + nx * len * bend * 0.3, my = y + uy * len * 0.45 + ny * len * bend * 0.3;
  const r = (v: number) => Math.round(v * 10) / 10;
  return {
    fill: true,
    d: `M${r(x)} ${r(y)} Q ${r(mx + nx * w)} ${r(my + ny * w)} ${r(ex)} ${r(ey)} Q ${r(mx - nx * w * 0.4)} ${r(my - ny * w * 0.4)} ${r(x)} ${r(y)} Z`,
  };
}

const tigerHalf = [
  // ear
  "M58 74 C 46 52 54 36 72 40 C 82 44 88 52 90 58",
  "M64 66 C 60 54 66 48 74 50",
  // brow + eye
  "M80 100 C 90 92 104 92 110 98",
  "M84 112 C 92 102 106 102 112 112 C 104 118 92 118 84 112",
  "M98 108 C 96 110 96 113 98 115 C 100 113 100 110 98 108",
  // nose bridge
  "M110 118 C 112 134 112 144 108 152",
  // forehead stripes
  "M104 60 C 108 70 108 78 104 86",
  "M90 70 C 96 76 98 84 94 92",
  // cheek stripes
  "M36 128 C 48 128 58 132 66 140",
  "M40 150 C 52 148 62 152 70 160",
  "M58 178 C 66 172 74 172 82 176",
  // whiskers
  "M90 164 C 70 160 50 162 32 170",
  "M90 170 C 72 172 56 178 42 188",
  // mouth
  "M120 176 C 112 186 100 186 94 178",
];

const tigerHead: Stroke[] = [
  {
    d: "M120 40 C 160 38 190 60 196 92 C 214 100 222 124 210 146 C 222 160 206 184 186 186 C 172 210 146 222 120 222 C 94 222 68 210 54 186 C 34 184 18 160 30 146 C 18 124 26 100 44 92 C 50 60 80 38 120 40",
  },
  { d: "M120 56 L 120 80" },
  ...tigerHalf.flatMap((d) => [{ d }, { d: mirror(d, 240) }]),
  { d: "M106 152 C 112 148 128 148 134 152 C 130 162 124 166 120 166 C 116 166 110 162 106 152" },
  { d: "M120 166 L 120 176" },
  { d: "M104 198 C 112 204 128 204 136 198" },
];

export const drawings = {
  tiger: {
    viewBox: "0 0 240 240",
    label: "line drawing of a tiger's face",
    strokes: tigerHead,
  },
  tigerFull: {
    viewBox: "0 0 580 380",
    label: "line drawing of a crouching tiger with brush stripes",
    strokes: [
      // head (the face above, scaled down)
      ...tigerHead.map((st) => ({ ...st, transform: "translate(4 10) scale(0.86)" })),
      // body
      { d: "M186 84 C 240 58 300 76 350 82 C 400 88 440 72 476 98 C 504 120 514 160 508 200" },
      { d: "M508 200 C 506 240 488 268 458 282" },
      { d: "M432 128 C 408 176 412 240 448 280" },
      { d: "M458 282 C 468 304 470 324 460 340 C 482 340 500 346 502 356 C 490 364 456 364 434 360 C 430 342 430 320 426 300" },
      { d: "M214 228 C 270 252 340 266 426 300" },
      // front legs
      { d: "M150 196 C 146 236 136 272 112 306 C 98 326 76 334 60 344 C 66 358 100 360 128 354 C 152 348 170 330 182 306 C 192 286 200 260 208 236" },
      { d: "M78 342 L 82 356" },
      { d: "M96 340 L 99 357" },
      { d: "M240 240 C 244 274 242 304 230 328 C 222 342 208 350 214 360 C 236 364 258 360 268 350 C 272 322 272 292 266 262" },
      // tail
      { d: "M500 166 C 532 146 552 116 548 84 C 544 54 516 48 502 68 C 492 84 504 100 522 94" },
      { d: "M504 184 C 546 164 570 124 562 80" },
      // brush stripes: [x, y, length, angle°, width]
      ...(
        [
          [210, 86, 46, 112, 9],
          [244, 68, 62, 98, 11],
          [282, 72, 66, 94, 11],
          [320, 78, 64, 96, 10],
          [358, 82, 66, 92, 11],
          [396, 84, 60, 98, 10],
          [432, 84, 56, 108, 10],
          [462, 94, 50, 126, 9],
          [488, 118, 44, 146, 8],
          [504, 160, 36, 168, 7],
          [270, 252, 36, -84, 7],
          [326, 268, 36, -80, 7],
          [380, 284, 32, -74, 6],
          [500, 206, 42, 174, 8],
          [494, 236, 42, 180, 8],
          [480, 264, 34, 190, 7],
          [198, 254, 32, 192, 7],
          [188, 286, 30, 200, 6],
          [272, 290, 26, 184, 6],
          [268, 320, 22, 190, 5],
          [566, 100, 22, 196, 6],
          [554, 128, 22, 214, 6],
          [534, 152, 22, 234, 6],
          [552, 64, 18, 172, 5],
        ] as const
      ).map(([x, y, len, angle, w]) => stripe(x, y, len, angle, w)),
    ],
  },
  blossom: {
    viewBox: "0 0 120 140",
    label: "line drawing of a small blossom",
    strokes: [
      ...[0, 72, 144, 216, 288].map((deg) => ({
        d: "M60 60 C 46 46 48 24 60 18 C 72 24 74 46 60 60",
        transform: `rotate(${deg} 60 60)`,
      })),
      { d: "M60 53 C 64 53 67 56 67 60 C 67 64 64 67 60 67 C 56 67 53 64 53 60 C 53 56 56 53 60 53 Z", fill: true },
      { d: "M66 88 C 74 104 76 120 70 136" },
      { d: "M72 112 C 86 104 98 106 104 112 C 94 120 82 120 72 112 Z", fill: true },
    ],
  },
  swirl: {
    viewBox: "0 0 220 110",
    label: "line drawing of a curling cloud",
    strokes: [
      { d: "M10 80 C 30 80 40 60 60 60 C 80 60 86 82 70 86 C 58 88 54 74 64 72" },
      { d: "M60 60 C 64 36 90 26 108 40 C 124 52 116 74 100 72 C 90 70 92 58 100 58" },
      { d: "M104 38 C 130 18 170 24 182 46 C 192 64 176 80 164 72 C 156 66 162 56 170 58" },
      { d: "M8 92 C 60 98 130 94 212 84" },
      { d: "M40 102 C 90 106 140 102 190 96" },
    ],
  },
  cloud: {
    viewBox: "0 0 260 150",
    label: "line drawing of two clouds",
    strokes: [
      { d: "M34 100 C 12 100 12 72 34 70 C 32 48 60 40 74 54 C 82 30 120 28 130 52 C 142 40 168 46 166 66 C 188 64 194 98 170 100 L 34 100" },
      { d: "M62 82 C 70 72 86 74 86 86" },
      { d: "M120 74 C 128 66 142 70 140 80" },
      { d: "M20 114 L 112 114" },
      { d: "M132 114 L 150 114" },
      { d: "M156 128 C 144 128 144 110 158 110 C 160 98 178 96 184 106 C 196 100 210 108 206 120 C 216 122 214 132 204 132 L 156 132" },
      { d: "M214 40 C 222 34 232 36 236 44" },
      { d: "M222 54 C 228 50 236 52 238 58" },
    ],
  },
  flower: {
    viewBox: "0 0 160 260",
    label: "line drawing of a flower",
    strokes: [
      { d: "M80 252 C 78 200 84 160 80 108" },
      { d: "M80 204 C 60 194 44 174 40 152 C 60 158 74 174 80 192" },
      { d: "M81 172 C 100 162 116 142 118 124 C 100 130 86 144 82 162" },
      ...[0, 72, 144, 216, 288].map((deg) => ({
        d: "M80 80 C 62 64 64 36 80 28 C 96 36 98 64 80 80",
        transform: `rotate(${deg} 80 80)`,
      })),
      { d: "M80 70 C 86 70 90 74 90 80 C 90 86 86 90 80 90 C 74 90 70 86 70 80 C 70 74 74 70 80 70" },
      { d: "M24 240 C 50 236 110 236 138 242" },
    ],
  },
  croquis: {
    viewBox: "0 0 200 400",
    label: "fashion sketch of a figure in an A-line dress",
    strokes: [
      { d: "M100 22 C 112 22 116 34 114 44 C 112 54 106 60 100 60 C 94 60 88 54 86 44 C 84 34 88 22 100 22" },
      { d: "M88 30 C 84 18 96 10 106 14 C 114 16 116 24 112 30" },
      { d: "M96 60 L 95 74" },
      { d: "M104 60 L 105 74" },
      { d: "M95 74 C 84 76 74 80 70 86" },
      { d: "M105 74 C 116 76 126 80 130 86" },
      { d: "M90 80 C 96 92 104 92 110 80" },
      { d: "M76 86 C 80 110 84 126 88 140" },
      { d: "M124 86 C 120 110 116 126 112 140" },
      { d: "M88 140 C 96 143 104 143 112 140" },
      { d: "M70 86 C 64 120 62 150 66 180 C 67 186 70 190 72 188" },
      { d: "M130 86 C 140 110 146 130 140 150 C 136 156 128 150 118 146" },
      { d: "M88 140 C 74 200 56 250 40 300 C 60 308 70 300 80 306 C 92 312 100 302 112 308 C 126 312 140 302 160 300 C 144 250 126 200 112 140" },
      { d: "M98 150 C 94 200 88 250 80 304" },
      { d: "M104 150 C 110 200 116 250 124 306" },
      { d: "M88 308 L 84 380 L 74 388" },
      { d: "M112 308 L 118 380 L 130 386" },
    ],
  },
} satisfies Record<string, Drawing>;

export type LineArtName = keyof typeof drawings;
