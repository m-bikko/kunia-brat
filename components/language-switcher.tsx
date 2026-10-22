import Link from "next/link";
import { Fragment } from "react";

import { localeLabel, localeName, localePath, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}

/** RU · KZ · EN in mono, the current one in ink. Each locale is a separate static page. */
export const LanguageSwitcher = ({ locale, label, tone = "light", className }: LanguageSwitcherProps): React.JSX.Element => (
  <nav aria-label={label} className={cn("flex items-center gap-2 font-mono text-xs", className)}>
    {locales.map((code, index) => {
      const active = code === locale;
      return (
        <Fragment key={code}>
          {index > 0 && (
            <span aria-hidden className={tone === "light" ? "text-line-strong" : "text-white/30"}>
              ·
            </span>
          )}
          <Link
            href={localePath(code)}
            hrefLang={code}
            lang={code}
            aria-label={localeName[code]}
            aria-current={active ? "true" : undefined}
            className={cn(
              "transition-colors",
              tone === "light"
                ? active
                  ? "text-ink underline decoration-brand decoration-2 underline-offset-4"
                  : "text-ink-faint hover:text-ink"
                : active
                  ? "text-white underline decoration-brand-light decoration-2 underline-offset-4"
                  : "text-white/55 hover:text-white",
            )}
          >
            {localeLabel[code]}
          </Link>
        </Fragment>
      );
    })}
  </nav>
);
