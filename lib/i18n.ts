/**
 * Locale registry for the landing.
 * Russian is the default and lives at "/" (keeps the live site's URLs and SEO);
 * Kazakh and English live at "/kk" and "/en".
 */
export const locales = ["ru", "kk", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Path of the landing for a locale, with an optional "#anchor". */
export const localePath = (locale: Locale, hash = ""): string =>
  `${locale === defaultLocale ? "/" : `/${locale}`}${hash}`;

export const openGraphLocale: Record<Locale, string> = {
  ru: "ru_RU",
  kk: "kk_KZ",
  en: "en_US",
};

/** Short labels for the language switcher. */
export const localeLabel: Record<Locale, string> = {
  ru: "RU",
  kk: "KZ",
  en: "EN",
};

/** Native names, used for aria-labels in the language switcher. */
export const localeName: Record<Locale, string> = {
  ru: "Русский",
  kk: "Қазақша",
  en: "English",
};

export interface PluralForms {
  one: string;
  few?: string;
  many?: string;
  other: string;
}

/** Picks the grammatically correct form for a number (ru: one/few/many, en: one/other). */
export const plural = (locale: Locale, count: number, forms: PluralForms): string => {
  const category = new Intl.PluralRules(locale).select(count);
  const byCategory: Partial<Record<Intl.LDMLPluralRule, string | undefined>> = {
    one: forms.one,
    few: forms.few,
    many: forms.many,
  };
  return byCategory[category] ?? forms.other;
};
