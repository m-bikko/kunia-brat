import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/content/dictionaries";
import { localeLabel, localePath, locales } from "@/lib/i18n";

/** 404 body as an empty drawing sheet: Russian copy first, links to every language version. */
export const NotFoundContent = (): React.JSX.Element => {
  const t = getDictionary("ru");

  return (
    <div className="bg-blueprint grid min-h-dvh place-items-center bg-paper px-4">
      <main className="w-full max-w-xl border border-ink bg-surface p-8 sm:p-10">
        <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} className="h-7 w-auto" />
        <p className="mt-12 font-mono text-xs text-brand">404 · {t.stamp.sheet} 00</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink">{t.notFound.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-muted">{t.notFound.text}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            {t.notFound.home}
          </Link>
          {locales
            .filter((locale) => locale !== "ru")
            .map((locale) => (
              <Link key={locale} href={localePath(locale)} hrefLang={locale} className={buttonVariants({ variant: "outline", size: "lg" })}>
                {getDictionary(locale).notFound.home} ({localeLabel[locale]})
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
};
