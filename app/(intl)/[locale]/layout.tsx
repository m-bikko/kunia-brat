import "../../globals.css";

import type { Metadata } from "next";

import { SiteDocument } from "@/components/site-document";
import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";

export { viewport } from "@/lib/metadata";

/** Only the non-default locales get a prefix: /kk and /en. Other values 404 in the page. */
export const generateStaticParams = (): Array<{ locale: Locale }> =>
  locales.filter((locale) => locale !== defaultLocale).map((locale) => ({ locale }));

/** Falls back to the default locale so an unknown segment can still render its 404 page. */
const resolveLocale = async (params: Promise<{ locale: string }>): Promise<Locale> => {
  const { locale } = await params;
  return isLocale(locale) && locale !== defaultLocale ? locale : defaultLocale;
};

export const generateMetadata = async ({ params }: LayoutProps<"/[locale]">): Promise<Metadata> =>
  buildMetadata(await resolveLocale(params));

const LocaleLayout = async ({ children, params }: LayoutProps<"/[locale]">): Promise<React.JSX.Element> => (
  <SiteDocument locale={await resolveLocale(params)}>{children}</SiteDocument>
);

export default LocaleLayout;
