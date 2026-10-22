import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { LanguagePills } from "@/components/v2/language-pills";
import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { site, sitePaths, whatsappUrl } from "@/lib/site";
import { versionPath } from "@/lib/versions";

interface FooterV2Props {
  locale: Locale;
  t: Dictionary;
}

const linkClass = "rounded-md text-white/85 transition-colors hover:text-sun";
const headingClass = "text-sm font-extrabold tracking-wide text-sun uppercase";

/** Current year, cached so the footer stays part of the static prerender. */
const getCopyrightYear = async (): Promise<number> => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};

/** Navy footer with a rounded top: about, solutions, navigation, contacts. */
export const FooterV2 = async ({ locale, t }: FooterV2Props): Promise<React.JSX.Element> => {
  const year = await getCopyrightYear();
  const navigation = [
    { href: sitePaths.catalog, label: t.nav.catalog },
    { href: sitePaths.services, label: t.nav.services },
    { href: sitePaths.about, label: t.nav.about },
    { href: sitePaths.guide, label: t.footer.guide },
    { href: sitePaths.order70, label: t.footer.order70 },
  ];

  return (
    <footer className="on-navy mt-10 rounded-t-[40px] bg-navy text-white">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 pt-14 pb-10 sm:px-8 lg:grid-cols-12 lg:pt-20">
        <div className="lg:col-span-4">
          <Link href={versionPath(locale, "v2")} aria-label="AXIS" className="inline-block rounded-md">
            <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} className="h-7 w-auto brightness-0 invert" />
          </Link>
          <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-white/85">{t.footer.about}</p>
        </div>
        <nav aria-labelledby="footer-v2-solutions" className="lg:col-span-3">
          <h2 id="footer-v2-solutions" className={headingClass}>
            {t.footer.solutions}
          </h2>
          <ul className="mt-4 grid gap-2.5">
            {cabinetIds.map((id) => (
              <li key={id}>
                <a href={cabinets[id].href} className={linkClass}>
                  {t.cabinets.items[id].name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-v2-navigation" className="lg:col-span-2">
          <h2 id="footer-v2-navigation" className={headingClass}>
            {t.footer.navigation}
          </h2>
          <ul className="mt-4 grid gap-2.5">
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
          <h2 className={headingClass}>{t.footer.contact}</h2>
          <ul className="mt-4 grid gap-2.5">
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
            <li className="text-white/85">{t.footer.address}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4 border-t-2 border-white/15 px-5 py-6 text-sm text-white/85 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {year} AXIS. {t.footer.rights}
        </p>
        <LanguagePills locale={locale} label={t.nav.languageLabel} className="self-start sm:self-auto" />
      </div>
    </footer>
  );
};
