import { en } from "@/content/locales/en";
import { kk } from "@/content/locales/kk";
import { ru } from "@/content/locales/ru";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n";

const dictionaries: Record<Locale, Dictionary> = { ru, kk, en };

/** Returns the copy for a locale. Dictionaries are small, so they are bundled statically. */
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
