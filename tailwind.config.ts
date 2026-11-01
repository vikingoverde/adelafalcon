import type { Config } from "tailwindcss";

/**
 * Design tokens. The whole site is one colour on paper, like a film's end credits.
 * - `red` is used for ALL text, lines and focus rings. #CC2920 is 4.7:1 on the paper colour,
 *   so it is readable even at the tiny 10px label size.
 * Change these two values and the whole site follows.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F1F0EC", deep: "#E5E4DF" },
        red: { DEFAULT: "#CC2920" },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        /** Role labels: "DIRECTED BY". */
        micro: ["0.625rem", { lineHeight: "1.2", letterSpacing: "0.06em" }],
        /** Corner menu and captions. */
        nav: ["0.6875rem", { lineHeight: "1.25", letterSpacing: "0.04em" }],
        /** Credit names. */
        credit: ["clamp(1rem, 1.35vw, 1.3rem)", { lineHeight: "1.2", letterSpacing: "0.02em" }],
        /** Body paragraphs. */
        body: ["0.875rem", { lineHeight: "1.6", letterSpacing: "0.01em" }],
      },
      maxWidth: { sheet: "90rem" },
    },
  },
  plugins: [],
};

export default config;
