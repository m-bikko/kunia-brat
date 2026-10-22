import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { site, sitePaths, whatsappUrl } from "@/lib/site";

interface SiteFooterProps {
  locale: Locale;
  t: Dictionary;
}

const linkClass = "text-white/70 transition-colors hover:text-white";

/** Current year, cached so the footer stays part of the static prerender. */
const getCopyrightYear = async (): Promise<number> => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};

/** Dark footer: solutions, navigation and contacts, same links as the live site. */
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
    <footer className="bg-ink-deep text-white">
      <div className="container-axis grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Link href={localePath(locale)} aria-label="AXIS" className="inline-block">
            <Image
              src="/brand/axis-logo.png"
              alt="AXIS"
              width={2108}
              height={640}
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-5 max-w-[34ch] leading-relaxed text-white/70">{t.footer.about}</p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "light", className: "mt-7" })}
          >
            {t.nav.contactCta}
          </a>
        </div>

        <nav aria-labelledby="footer-solutions" className="lg:col-span-3">
          <h2 id="footer-solutions" className="text-xs font-bold tracking-[0.14em] text-brand-light uppercase">
            {t.footer.solutions}
          </h2>
          <ul className="mt-5 grid gap-3 text-[0.95rem]">
            {cabinetIds.map((id) => (
              <li key={id}>
                <a href={cabinets[id].href} className={linkClass}>
                  {t.cabinets.items[id].name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-navigation" className="lg:col-span-2">
          <h2 id="footer-navigation" className="text-xs font-bold tracking-[0.14em] text-brand-light uppercase">
            {t.footer.navigation}
          </h2>
          <ul className="mt-5 grid gap-3 text-[0.95rem]">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-xs font-bold tracking-[0.14em] text-brand-light uppercase">{t.footer.contact}</h2>
          <ul className="mt-5 grid gap-3 text-[0.95rem]">
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
            <li className="text-white/70">{t.footer.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-axis flex flex-col gap-4 py-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} AXIS. {t.footer.rights}
          </p>
          <LanguageSwitcher locale={locale} label={t.nav.languageLabel} tone="dark" />
        </div>
      </div>
    </footer>
  );
};
