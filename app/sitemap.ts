import type { MetadataRoute } from "next";

import { localePath, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Landing in every language, each entry listing its hreflang alternates. */
const sitemap = (): MetadataRoute.Sitemap => {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, new URL(localePath(locale), site.url).toString()]),
  );

  return locales.map((locale) => ({
    url: new URL(localePath(locale), site.url).toString(),
    changeFrequency: "monthly",
    priority: locale === "ru" ? 1 : 0.8,
    alternates: { languages },
  }));
};

export default sitemap;
