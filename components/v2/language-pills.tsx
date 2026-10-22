import Link from "next/link";

import { localeLabel, localeName, locales, type Locale } from "@/lib/i18n";
import { versionPath } from "@/lib/versions";
import { cn } from "@/lib/utils";

/** RU · KZ · EN as a segmented capsule; every link stays on v2. */
export const LanguagePills = ({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}): React.JSX.Element => (
  <nav aria-label={label} className={cn("flex items-center rounded-full border-[2.5px] border-navy bg-white p-1", className)}>
    {locales.map((code) => {
      const active = code === locale;
      return (
        <Link
          key={code}
          href={versionPath(code, "v2")}
          hrefLang={code}
          lang={code}
          aria-label={localeName[code]}
          aria-current={active ? "true" : undefined}
          className={cn(
            "grid h-8 min-w-10 place-items-center rounded-full px-2.5 text-[13px] font-extrabold transition-colors",
            active ? "bg-navy text-white" : "text-navy hover:bg-sky",
          )}
        >
          {localeLabel[code]}
        </Link>
      );
    })}
  </nav>
);
