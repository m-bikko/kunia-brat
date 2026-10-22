import "./globals.css";

import type { Metadata } from "next";

import { NotFoundContent } from "@/components/not-found-content";
import { getDictionary } from "@/content/dictionaries";
import { fontVariables } from "@/lib/fonts";

/** Routing-level 404, required because the app has two root layouts ("/" and "/[locale]"). */
export const metadata: Metadata = {
  title: `404 · ${getDictionary("ru").notFound.title}`,
  robots: { index: false },
};

const GlobalNotFound = (): React.JSX.Element => (
  <html lang="ru" className={fontVariables}>
    <body>
      <NotFoundContent />
    </body>
  </html>
);

export default GlobalNotFound;
