import { Fragment } from "react";
import { ArrowDownRight } from "lucide-react";

import { PlanDrawing } from "@/components/sections/plan-drawing";
import { Stamp, sheetTag } from "@/components/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cabinetIds } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface HeroSheetProps {
  locale: Locale;
  t: Dictionary;
}

/** "Sheet 01": huge headline over visible column lines on the left, the classroom sketch with a title block on the right. */
export const HeroSheet = ({ locale, t }: HeroSheetProps): React.JSX.Element => {
  const lines = t.hero.title;

  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <div className="container-axis">
        <div className="bg-columns grid border-x border-line lg:min-h-[min(calc(100dvh-5rem),50rem)] lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-12 px-4 py-10 sm:px-6 lg:col-span-7 lg:py-14 lg:pr-10 lg:pl-8">
            <div>
              <p className="reveal font-mono text-xs text-ink-muted">{t.hero.kicker}</p>
              <h1
                id="hero-title"
                className="mt-8 text-[clamp(3rem,7.2vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.055em] text-ink lg:mt-10"
              >
                {lines.map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 && " "}
                    <span className="reveal block" style={{ "--reveal-delay": `${0.08 + index * 0.08}s` }}>
                      {line}
                      {index === lines.length - 1 && (
                        <span aria-hidden className="ml-[0.06em] inline-block size-[0.17em] bg-brand" />
                      )}
                    </span>
                  </Fragment>
                ))}
              </h1>
            </div>

            <div className="reveal grid gap-6 border-t border-line pt-6 sm:grid-cols-7" style={{ "--reveal-delay": "0.45s" }}>
              <p className="text-[1.05rem] leading-relaxed text-pretty text-ink-2 sm:col-span-4 sm:pr-4">{t.hero.subtitle}</p>
              <div className="flex flex-col gap-3 sm:col-span-3">
                <a href={localePath(locale, "#order70")} className={cn(buttonVariants({ size: "lg" }), "justify-between")}>
                  {t.hero.primaryCta}
                  <ArrowDownRight aria-hidden />
                </a>
                <a
                  href={localePath(locale, "#index")}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "justify-between")}
                >
                  {t.hero.secondaryCta}
                  <span className="font-mono text-xs opacity-60">{String(cabinetIds.length).padStart(2, "0")}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col border-t border-line bg-surface lg:col-span-5 lg:border-t-0 lg:border-l">
            <div className="label-mono flex h-11 items-center justify-between border-b border-line px-5 text-ink-muted">
              <span>
                {sheetTag(t.stamp, 1)} · {t.hero.sheetLabel}
              </span>
              <span>{t.hero.sheetScale}</span>
            </div>
            <PlanDrawing
              callouts={t.hero.callouts}
              axisX={t.hero.axisX}
              axisY={t.hero.axisY}
              label={t.process.illustrationAlt}
            />
            <Stamp t={t.stamp} sheet="01 / 08" />
          </div>
        </div>
      </div>
    </section>
  );
};
