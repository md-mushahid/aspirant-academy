import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

// Light-only site — keep browser UI light on dark-mode devices too.
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#faf7f0",
};

// Self-hosted at build time — premium editorial pairing, no runtime external fetch.
// Fraunces + Inter are VARIABLE fonts: next/font ships one file per unicode-range
// subset (not per weight), and only the `latin` subset (~132 KB) is preloaded for
// English text — the cyrillic/greek/etc. files are never fetched (unicode-range gated).
// So `weight` here selects the exposed instances, not the payload. `swap` + built-in
// fallback-metrics keep CLS low. Dropping `italic` is the only ~40 KB lever (kept for design).
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"], // used by .serif tagline + quote mark
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aspirant Academy — Score higher with expert-led IELTS prep",
  description:
    "Master IELTS Reading, Writing, Listening and Speaking with video lessons, full practice tests, instant auto-marking, and real teacher feedback. Start free.",
  openGraph: {
    title: "Aspirant Academy — Score higher with expert-led IELTS prep",
    description:
      "Video lessons, real practice tests, and band-score feedback from IELTS teachers. Preview lessons free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
