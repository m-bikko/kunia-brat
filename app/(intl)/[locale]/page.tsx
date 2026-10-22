import { notFound } from "next/navigation";

import { LandingPage } from "@/components/landing-page";
import { defaultLocale, isLocale } from "@/lib/i18n";

export const ensureStatic = "navigation";

const LocalizedHomePage = async ({ params }: PageProps<"/[locale]">): Promise<React.JSX.Element> => {
  const { locale } = await params;
  if (!isLocale(locale) || locale === defaultLocale) notFound();
  return <LandingPage locale={locale} />;
};

export default LocalizedHomePage;
