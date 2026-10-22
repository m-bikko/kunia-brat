import { ArrowDownRight } from "lucide-react";

import { Sticker } from "@/components/v2/ui/sticker";
import { softButton } from "@/components/v2/ui/soft-button";
import type { Dictionary } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { versionPath } from "@/lib/versions";
import { cn } from "@/lib/utils";

/** First screen of v2: kicker, the big rounded headline, subtitle and the two calls to action. */
export const HeroV2 = ({ locale, t }: { locale: Locale; t: Dictionary }): React.JSX.Element => (
  <section aria-labelledby="hero-v2-title" className="mx-auto max-w-[1240px] px-5 pt-10 pb-16 sm:px-8 lg:pt-16 lg:pb-24">
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <Sticker tone="sun" className="reveal">
          {t.hero.kicker}
        </Sticker>
        <h1
          id="hero-v2-title"
          className="reveal mt-6 text-[clamp(2.4rem,6vw,5.25rem)] leading-[0.98] font-black tracking-[-0.03em] [overflow-wrap:anywhere]"
        >
          {t.hero.title.map((line) => (
            <span key={line} className="block">
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className="reveal mt-6 max-w-[46ch] text-lg leading-relaxed font-semibold text-navy-muted lg:text-xl">{t.hero.subtitle}</p>
        <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={versionPath(locale, "v2", "#order70")} className={softButton({ size: "lg" })}>
            {t.hero.primaryCta}
            <ArrowDownRight aria-hidden />
          </a>
          <a href={versionPath(locale, "v2", "#index")} className={cn(softButton({ variant: "outline", size: "lg" }))}>
            {t.hero.secondaryCta}
            <span className="grid size-7 place-items-center rounded-full bg-sun text-[13px]">08</span>
          </a>
        </div>
      </div>
      <div className="lg:col-span-6" data-hero-art />
    </div>
  </section>
);
