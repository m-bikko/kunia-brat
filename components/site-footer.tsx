import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { site, sitePaths, whatsappUrl } from "@/lib/site";

interface SiteFooterProps {
  locale: Locale;
  t: Dictionary;
}

const linkClass = "text-ink-2 transition-colors hover:text-brand";

/** Current year, cached so the footer stays part of the static prerender. */
const getCopyrightYear = async (): Promise<number> => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};

/** Footer as the title block of the last sheet: about, solutions, navigation, contacts. */
export const SiteFooter = async ({ locale, t }: SiteFooterProps): Promise<React.JSX.Element> => {
  const year = await getCopyrightYear();
  const navigation = [
    { href: sitePaths.catalog, label: t.nav.catalog },
    { href: sitePaths.services, label: t.nav.services },
    { href: sitePaths.about, label: t.nav.about },
    { href: sitePaths.guide, label: t.footer.guide },
    { href: sitePaths.order70, label: t.footer.order70 },
  ];

  return (
    <footer className="py-10 lg:py-14">
      <div className="container-axis">
        <div className="grid gap-px border border-ink bg-line lg:grid-cols-12">
          <div className="bg-paper p-6 lg:col-span-4 lg:p-8">
            <Link href={localePath(locale)} aria-label="AXIS" className="inline-block">
              <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} className="h-7 w-auto" />
            </Link>
            <p className="mt-5 max-w-[34ch] leading-relaxed text-ink-muted">{t.footer.about}</p>
          </div>

          <nav aria-labelledby="footer-solutions" className="bg-paper p-6 lg:col-span-3 lg:p-8">
            <h2 id="footer-solutions" className="label-mono text-ink-faint">
              {t.footer.solutions}
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {cabinetIds.map((id) => (
                <li key={id}>
                  <a href={cabinets[id].href} className={linkClass}>
                    {t.cabinets.items[id].name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-navigation" className="bg-paper p-6 lg:col-span-2 lg:p-8">
            <h2 id="footer-navigation" className="label-mono text-ink-faint">
              {t.footer.navigation}
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="bg-paper p-6 lg:col-span-3 lg:p-8">
            <h2 className="label-mono text-ink-faint">{t.footer.contact}</h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              <li>
                <a href={site.phoneHref} className={`${linkClass} tabular-nums`}>
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
              <li className="text-ink-muted">{t.footer.address}</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 bg-paper px-6 py-4 font-mono text-[11px] text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:col-span-12 lg:px-8">
            <p>
              © {year} AXIS. {t.footer.rights}
            </p>
            <LanguageSwitcher locale={locale} label={t.nav.languageLabel} />
            <p>{t.stamp.sheet} 08 / 08</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
