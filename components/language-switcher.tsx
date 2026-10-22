import Link from "next/link";

import { localeLabel, localeName, localePath, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}

/** RU / KZ / EN segmented links. Each locale is a separate static page. */
export const LanguageSwitcher = ({
  locale,
  label,
  tone = "light",
  className,
}: LanguageSwitcherProps): React.JSX.Element => (
  <nav aria-label={label} className={cn("flex items-center gap-0.5 text-[0.8rem] font-semibold", className)}>
    {locales.map((code) => {
      const active = code === locale;
      return (
        <Link
          key={code}
          href={localePath(code)}
          hrefLang={code}
          lang={code}
          aria-label={localeName[code]}
          aria-current={active ? "true" : undefined}
          className={cn(
            "rounded-full px-2.5 py-1.5 transition-colors",
            tone === "light"
              ? active
                ? "bg-ink text-white"
                : "text-ink-muted hover:text-ink"
              : active
                ? "bg-white text-ink-deep"
                : "text-white/65 hover:text-white",
          )}
        >
          {localeLabel[code]}
        </Link>
      );
    })}
  </nav>
);
