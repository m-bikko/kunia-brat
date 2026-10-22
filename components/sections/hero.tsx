import { ArrowDown, MessageCircle } from "lucide-react";

import { HeroBackdrop } from "@/components/sections/hero-backdrop";
import { HeroVisual, type HeroSlide } from "@/components/sections/hero-visual";
import { buttonVariants } from "@/components/ui/button";
import { cabinets, heroCabinetIds } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/** CSS entrance (runs before hydration, so the LCP headline never waits for JS). */
const enter =
  "motion-safe:animate-in fade-in slide-in-from-bottom-3 fill-mode-both animation-duration-700 ease-out";

interface HeroProps {
  locale: Locale;
  t: Dictionary;
}

/** Asymmetric hero: headline left, value line and CTAs right, cinematic render strip below. */
export const Hero = ({ locale, t }: HeroProps): React.JSX.Element => {
  const slides: HeroSlide[] = heroCabinetIds.map((id) => ({
    id,
    name: t.cabinets.items[id].name,
    image: cabinets[id].image,
  }));

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <HeroBackdrop />
      <div className="container-axis pt-8 pb-14 sm:pt-12 lg:pt-16 lg:pb-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className={cn("lg:col-span-8", enter)}>
            <h1
              id="hero-title"
              className="text-[clamp(2.15rem,4.7vw,4.6rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-ink"
            >
              {t.hero.title.lead} <span className="text-brand">{t.hero.title.accent}</span>
            </h1>
          </div>

          <div className={cn("lg:col-span-4 lg:pb-1.5", enter, "delay-150")}>
            <p className="max-w-[36ch] text-lg leading-relaxed text-pretty text-ink-muted">{t.hero.subtitle}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a href={localePath(locale, "#solutions")} className={cn(buttonVariants({ size: "lg" }))}>
                {t.hero.primaryCta}
                <ArrowDown aria-hidden className="transition-transform group-hover/button:translate-y-0.5" />
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                <MessageCircle aria-hidden />
                {t.nav.contactCta}
              </a>
            </div>
          </div>
        </div>

        <div className={cn("mt-10 lg:mt-14", enter, "delay-300")}>
          <HeroVisual slides={slides} caption={t.hero.conceptCaption} slideLabel={t.hero.slideLabel} />
        </div>
      </div>
    </section>
  );
};
