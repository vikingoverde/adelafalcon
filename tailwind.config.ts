import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

/**
 * Design tokens. Change colours here and every component follows.
 * - `accent` is fluorescent "brat" green for line art, stripes, cursor, highlights. At 1.7:1 it is far too light for text on paper (ink text ON it is fine: 8.7:1).
 * - `accent-ink` is the text-safe deep green (4.8:1 on paper) for labels, links, counters, focus rings.
 * LineArt and Scribble draw with `currentColor`, so changing these two values recolours everything.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F1F0EC", deep: "#E5E4DF", white: "#FBFBF9" },
        ink: { DEFAULT: "#1E1E1C", soft: "#5A5650" },
        accent: { DEFAULT: "#8ACE00", ink: "#4B7500" },
        marker: { DEFAULT: "#E2557A", ink: "#C2185B" },
        pastel: {
          blush: "#F4C6CF",
          butter: "#F6E7A8",
          sky: "#C9DDF0",
          mint: "#CFE8D5",
          lilac: "#DCCFEA",
          peach: "#F7D2B8",
        },
        grid: "rgba(30, 30, 28, 0.06)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
        label: ["var(--font-label)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em" }], // 11px
        "label-sm": ["0.625rem", { lineHeight: "1", letterSpacing: "0.2em" }], // 10px
        type: ["0.8125rem", { lineHeight: "1.75", letterSpacing: "0.02em" }], // 13px typewriter body
        mega: ["clamp(3.5rem, 13vw, 12rem)", { lineHeight: "0.85", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        paper: "0 1px 1px rgba(30,30,28,0.06), 0 8px 18px -6px rgba(30,30,28,0.22)",
        lifted: "0 2px 2px rgba(30,30,28,0.06), 0 22px 36px -12px rgba(30,30,28,0.32)",
      },
      rotate: {
        "0.5": "0.5deg",
        "1.5": "1.5deg",
        "4": "4deg",
        "5": "5deg",
        "7": "7deg",
      },
      maxWidth: { sheet: "88rem" },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      // Gentle "sketchbook" tilt utilities: tilt-l-2 → rotate(-2deg), tilt-r-3 → rotate(3deg)
      const tilts: Record<string, Record<string, string>> = {};
      for (const n of [1, 2, 3, 4, 5, 6]) {
        tilts[`.tilt-l-${n}`] = { transform: `rotate(-${n}deg)` };
        tilts[`.tilt-r-${n}`] = { transform: `rotate(${n}deg)` };
      }
      addUtilities(tilts);
    }),
  ],
};

export default config;
