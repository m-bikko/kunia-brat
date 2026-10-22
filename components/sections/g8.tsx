import { ArrowUpRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { site } from "@/lib/site";

interface G8Props {
  t: Dictionary["g8"];
}

/** Cross-promo for G8, the sister site for school sports equipment. */
export const G8 = ({ t }: G8Props): React.JSX.Element => (
  <section aria-labelledby="g8-title" className="border-b border-line py-20 lg:py-24">
    <div className="container-axis">
      <div className="grid border border-line bg-surface lg:grid-cols-2">
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
          <h2 id="g8-title" className="text-[clamp(2rem,3.6vw,3rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-ink">
            {t.title.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-pretty text-ink-muted">{t.text}</p>
          <a
            href={site.g8Url}
            target="_blank"
            rel="noopener"
            className={buttonVariants({ variant: "outline", className: "mt-8 self-start" })}
          >
            {t.cta}
            <ArrowUpRight aria-hidden />
          </a>
        </div>
        <div aria-hidden className="bg-blueprint relative min-h-[18rem] border-t border-line bg-brand-soft p-8 sm:p-10 lg:border-t-0 lg:border-l">
          <p className="text-[clamp(3.5rem,7vw,5.5rem)] leading-none font-bold tracking-[-0.06em] text-brand">G8</p>
          {/* Pitch outline: a plain geometric mark, as on the live site. */}
          <svg
            viewBox="0 0 280 180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="absolute right-8 bottom-8 left-8 h-auto text-brand/70 sm:left-auto sm:w-[78%]"
          >
            <rect x="1" y="1" width="278" height="178" />
            <line x1="140" y1="1" x2="140" y2="179" />
            <circle cx="140" cy="90" r="24" />
            <circle cx="140" cy="90" r="1.5" fill="currentColor" />
            <rect x="1" y="45" width="36" height="90" />
            <rect x="1" y="68" width="14" height="44" />
            <rect x="243" y="45" width="36" height="90" />
            <rect x="265" y="68" width="14" height="44" />
          </svg>
        </div>
      </div>
    </div>
  </section>
);
