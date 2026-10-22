import Image from "next/image";
import Link from "next/link";

import { getDictionary } from "@/content/dictionaries";
import { localeLabel, localePath, locales } from "@/lib/i18n";

/** 404 body: Russian copy first, with a way back to every language version. */
export const NotFoundContent = (): React.JSX.Element => {
  const t = getDictionary("ru");

  return (
    <div className="bg-blueprint grid min-h-dvh place-items-center bg-paper px-4">
      <main className="w-full max-w-xl py-16">
        <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} className="h-8 w-auto" />
        <p className="mt-12 text-[5rem] leading-none font-semibold tracking-[-0.06em] text-brand">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-ink">{t.notFound.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-muted">{t.notFound.text}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-control bg-brand px-5 font-semibold text-white hover:bg-brand-hover"
          >
            {t.notFound.home}
          </Link>
          {locales
            .filter((locale) => locale !== "ru")
            .map((locale) => (
              <Link
                key={locale}
                href={localePath(locale)}
                hrefLang={locale}
                className="inline-flex h-12 items-center rounded-control border border-line-strong bg-surface px-5 font-semibold text-ink hover:border-brand hover:text-brand"
              >
                {getDictionary(locale).notFound.home} ({localeLabel[locale]})
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
};
