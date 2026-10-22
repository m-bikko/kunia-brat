import type { Metadata, Viewport } from "next";

import { getDictionary } from "@/content/dictionaries";
import { defaultLocale, localePath, locales, openGraphLocale, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { versionPath } from "@/lib/versions";

/** hreflang map shared by every locale: ru at "/", kk at "/kk", en at "/en". */
const languageAlternates = (): Record<string, string> => {
  const map: Record<string, string> = Object.fromEntries(
    locales.map((locale) => [locale, localePath(locale)]),
  );
  map["x-default"] = localePath(defaultLocale);
  return map;
};

export const buildMetadata = (locale: Locale): Metadata => {
  const t = getDictionary(locale);
  const path = localePath(locale);

  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: site.name,
    alternates: {
      canonical: path,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: `${site.name} (${site.legalName})`,
      title: t.meta.title,
      description: t.meta.description,
      locale: openGraphLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => openGraphLocale[l]),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: t.meta.ogImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: ["/og.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    formatDetection: { telephone: false },
  };
};

/** v2 is a design candidate next to v1: same copy, closed to indexing, no hreflang alternates. */
export const buildV2Metadata = (locale: Locale): Metadata => {
  const base = buildMetadata(locale);
  const path = versionPath(locale, "v2");
  return {
    ...base,
    alternates: { canonical: path },
    openGraph: { ...base.openGraph, url: path },
    robots: { index: false, follow: false },
  };
};

export const viewport: Viewport = {
  themeColor: "#f4f5f7",
  colorScheme: "light",
};
