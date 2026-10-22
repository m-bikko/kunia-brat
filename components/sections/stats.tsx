import { NumberTicker } from "@/components/ui/number-ticker";
import { stats } from "@/content/stats";
import type { Dictionary } from "@/content/types";
import { plural, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface StatsProps {
  locale: Locale;
  t: Dictionary["stats"];
}

/** Trust strip right under the hero. Numbers count up once when scrolled into view. */
export const Stats = ({ locale, t }: StatsProps): React.JSX.Element => (
  <section aria-label={t.label} className="border-y border-line bg-surface">
    <dl className="container-axis grid grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className={cn(
            "flex flex-col gap-2 py-8 lg:py-10",
            index % 2 === 1 ? "border-l border-line pl-5 sm:pl-8" : "pr-5 sm:pr-8",
            index >= 2 && "border-t border-line lg:border-t-0",
            index >= 1 && "lg:border-l lg:pl-8",
          )}
        >
          <dt className="order-2 text-sm leading-snug text-ink-muted sm:text-[0.95rem]">
            {plural(locale, stat.value, t.items[stat.id])}
          </dt>
          <dd className="order-1 text-[clamp(2.25rem,4vw,3.25rem)] leading-none font-semibold tracking-[-0.04em] text-ink">
            <NumberTicker value={stat.value} locale={locale} delay={index * 0.08} />
            {stat.suffix && <span className="text-brand">{stat.suffix}</span>}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);
