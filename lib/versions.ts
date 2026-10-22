import { localePath, type Locale } from "@/lib/i18n";
import type { SiteVersion } from "@/lib/intro";

/** Landing path of a locale in a site version: v1 "/", "/kk", "/en"; v2 "/v2", "/kk/v2", "/en/v2". */
export const versionPath = (locale: Locale, version: SiteVersion, hash = ""): string =>
  version === "v1" ? localePath(locale, hash) : `${localePath(locale).replace(/\/$/, "")}/v2${hash}`;
