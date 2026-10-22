import { Geist, Geist_Mono } from "next/font/google";

/** Text and headings. Covers the full Kazakh alphabet in cyrillic + cyrillic-ext. */
export const geist = Geist({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-geist",
  display: "swap",
});

/** Drawing annotations: sheet tags, codes, dimensions. */
export const geistMono = Geist_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = `${geist.variable} ${geistMono.variable}`;
