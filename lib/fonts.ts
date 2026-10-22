import { Manrope } from "next/font/google";
import localFont from "next/font/local";

/** Brand typeface (same as the live site). */
export const manrope = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-manrope",
  display: "swap",
});

/**
 * Manrope has no ә ғ қ ң ұ (and capitals). This 2 KB Onest subset carries exactly those
 * ten glyphs. It sits first in the font stack with a matching unicode-range, so it renders
 * only those letters and is downloaded only on pages that contain them (the Kazakh page).
 * Source: Onest, SIL OFL 1.1 (assets/fonts/onest-OFL.txt).
 */
export const kazakhGlyphs = localFont({
  src: "../assets/fonts/onest-kazakh.woff2",
  variable: "--font-kazakh",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0492-0493, U+049A-049B, U+04A2-04A3, U+04B0-04B1, U+04D8-04D9" }],
});

export const fontVariables = `${manrope.variable} ${kazakhGlyphs.variable}`;
