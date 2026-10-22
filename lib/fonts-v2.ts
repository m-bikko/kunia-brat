import { Nunito } from "next/font/google";

/** v2 text and headings: rounded terminals, full Kazakh alphabet (cyrillic + cyrillic-ext). v2 pages only. */
export const nunito = Nunito({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-nunito",
  display: "swap",
});
