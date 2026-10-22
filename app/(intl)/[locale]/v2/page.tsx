import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LandingV2 } from "@/components/v2/landing-v2";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { buildV2Metadata } from "@/lib/metadata";

export const ensureStatic = "navigation";

export const generateMetadata = async ({ params }: PageProps<"/[locale]/v2">): Promise<Metadata> => {
  const { locale } = await params;
  return buildV2Metadata(isLocale(locale) && locale !== defaultLocale ? locale : defaultLocale);
};

const LocalizedSoftHomePage = async ({ params }: PageProps<"/[locale]/v2">): Promise<React.JSX.Element> => {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) notFound();
  return <LandingV2 locale={locale} />;
};

export default LocalizedSoftHomePage;
