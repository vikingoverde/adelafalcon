import type { Metadata, Viewport } from "next";
import { Caveat, IBM_Plex_Mono, Instrument_Serif, Inter } from "next/font/google";
import { Backdrop } from "@/components/ui/Backdrop";
import { Cursor } from "@/components/ui/Cursor";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { site } from "@/lib/site";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-hand", display: "swap" });
const label = Inter({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-label", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: "website" },
};

export const viewport: Viewport = { themeColor: "#F1F0EC" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${hand.variable} ${label.variable}`}>
      <body className="min-h-dvh">
        <MotionProvider>
          <SiteHeader />
          {/* Clip collage pieces that poke past the page edge without breaking position: sticky/fixed. */}
          <div className="relative isolate overflow-x-clip">
            <Backdrop />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <SiteFooter />
          </div>
          <Cursor />
        </MotionProvider>
      </body>
    </html>
  );
}
