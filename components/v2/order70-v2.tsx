"use client";

import { Check, MessageCircle, RotateCcw } from "lucide-react";

import { softButton } from "@/components/v2/ui/soft-button";
import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { itemKey, useOrder70Kit } from "@/hooks/use-order70-kit";
import { plural, type Locale } from "@/lib/i18n";
import { fill } from "@/lib/template";
import { cn } from "@/lib/utils";

interface Order70V2Props {
  locale: Locale;
  t: Dictionary["order70"];
  copy: Dictionary["v2"]["order70"];
  items: Dictionary["cabinets"]["items"];
}

/**
 * v2 "#order70": the same kit logic as v1 (useOrder70Kit) in the soft language: classroom chips, round
 * ticks, counters in bubbles, a share bar and a send button that says how many items go for a quote.
 */
export const Order70V2 = ({ locale, t, copy, items }: Order70V2Props): React.JSX.Element => {
  const { active, select, tabRefs, onTabKeyDown, baseId, panelId, groups, isChecked, toggle, reset, total, have, need, href } =
    useOrder70Kit({ items, templates: t.message });
  const sendLabel = need === 0 ? t.send : fill(plural(locale, need, copy.send), { n: need });
  const share = total === 0 ? 0 : have / total;

  return (
    <section id="order70" aria-labelledby="order70-v2-title" className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8 lg:pt-28">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 id="order70-v2-title" className="text-[clamp(2.1rem,4.6vw,3.75rem)] leading-[1.02] font-black tracking-[-0.025em] lg:col-span-7">
          {t.title.map((line) => (
            <span key={line} className="block">
              {line}{" "}
            </span>
          ))}
        </h2>
        <p className="max-w-[48ch] text-lg leading-relaxed font-semibold text-navy-muted lg:col-span-5">{t.text}</p>
      </div>

      <div className="mt-10 overflow-clip rounded-card border-[2.5px] border-navy bg-white shadow-sticker">
        <div role="tablist" aria-label={t.tabsLabel} className="flex gap-2 overflow-x-auto border-b-[2.5px] border-navy bg-cloud p-3">
          {cabinetIds.map((id, index) => {
            const selected = id === active;
            return (
              <button
                key={id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`${baseId}-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-2 rounded-full border-[2.5px] border-navy pr-4 pl-1.5 text-[15px] font-extrabold whitespace-nowrap transition-colors",
                  selected ? "bg-navy text-white" : "bg-white text-navy hover:bg-sky",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 min-w-10 place-items-center rounded-full px-1.5 text-[11px] font-black",
                    selected ? "bg-sun text-navy" : "bg-sky text-navy",
                  )}
                >
                  {cabinets[id].code}
                </span>
                {items[id].name}
              </button>
            );
          })}
        </div>

        <div id={panelId} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className="grid lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="max-h-[38rem] overflow-y-auto px-4 pt-5 pb-6 sm:px-6">
            <div className="flex items-center justify-between gap-3 px-2">
              <span className="text-lg font-black">{items[active].name}</span>
              <span className="rounded-full bg-sky px-3 py-1 text-sm font-extrabold">
                {total} {t.itemsUnit}
              </span>
            </div>
            {groups.map((group, g) => (
              <fieldset key={group.category} className="mt-6">
                <legend className="ml-2 rounded-full bg-sun px-3 py-1 text-xs font-black tracking-wide uppercase">{group.category}</legend>
                <ul className="mt-2 grid gap-1">
                  {group.items.map((item, i) => {
                    const key = itemKey(g, i);
                    const on = isChecked(key);
                    return (
                      <li key={key}>
                        <label
                          className={cn(
                            "relative flex cursor-pointer items-start gap-3 rounded-tile px-2 py-2.5 text-[15px] font-semibold transition-colors",
                            on ? "bg-cloud" : "hover:bg-cloud",
                          )}
                        >
                          {/* The real checkbox sits invisibly on top of the drawn circle: it gets the click and the focus. */}
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggle(key)}
                            data-name={item.name}
                            className="peer absolute top-2.5 left-2 m-0 size-6 cursor-pointer opacity-0"
                          />
                          <span
                            aria-hidden
                            className={cn(
                              "grid size-6 shrink-0 place-items-center rounded-full border-[2.5px] border-navy transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
                              on ? "bg-ok text-white" : "bg-white",
                            )}
                          >
                            {on && <Check className="v2-pop size-3.5" strokeWidth={3.5} />}
                          </span>
                          <span className={cn("flex-1 text-pretty", on && "text-navy-muted line-through decoration-2")}>{item.name}</span>
                          <span className={cn("pt-0.5 text-xs font-extrabold", on ? "text-ok" : "text-navy-muted")}>
                            {on ? t.haveBadge : item.unit}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ))}
          </div>

          <aside className="sticky bottom-0 border-t-[2.5px] border-navy bg-cloud p-5 lg:static lg:border-t-0 lg:border-l-[2.5px]">
            <dl className="grid grid-cols-3 gap-2">
              {[
                { label: t.total, value: total, tone: "bg-sky", id: "order70-total" },
                { label: t.have, value: have, tone: "bg-sun", id: "order70-have" },
                { label: t.need, value: need, tone: "bg-coral", id: "order70-need" },
              ].map((bubble) => (
                <div key={bubble.id} className={cn("rounded-tile border-[2.5px] border-navy px-2 py-2 text-center lg:py-3", bubble.tone)}>
                  <dt className="text-[11px] leading-tight font-black tracking-wide uppercase">{bubble.label}</dt>
                  <dd data-testid={bubble.id} className="mt-1 text-2xl leading-none font-black tabular-nums lg:text-[1.75rem]">
                    {bubble.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div aria-hidden className="mt-4 hidden lg:block">
              <div className="flex justify-between text-sm font-extrabold">
                <span>{copy.shareLabel}</span>
                <span className="tabular-nums">{Math.round(share * 100)}%</span>
              </div>
              <div className="mt-1.5 h-4 overflow-hidden rounded-full border-[2.5px] border-navy bg-white">
                <div
                  className="h-full origin-left bg-ok transition-transform duration-500 ease-out motion-reduce:transition-none"
                  style={{ transform: `scaleX(${share})` }}
                />
              </div>
            </div>
            <p aria-live="polite" className="sr-only">
              {fill(copy.liveSummary, { have, total })}
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(softButton({ size: "lg" }), "mt-4 w-full justify-between text-left sm:whitespace-normal lg:mt-5")}
            >
              {sendLabel}
              <MessageCircle aria-hidden />
            </a>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-navy-muted">{t.hint}</p>
              <button
                type="button"
                onClick={reset}
                disabled={have === 0}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-[2.5px] border-navy bg-white px-3 py-1.5 text-sm font-extrabold transition-colors hover:bg-sky disabled:border-navy-muted disabled:text-navy-muted"
              >
                <RotateCcw aria-hidden className="size-3.5" />
                {t.reset}
              </button>
            </div>
          </aside>
        </div>
      </div>
      <p className="mt-4 px-2 text-sm font-semibold text-navy-muted">{t.sourceNote}</p>
    </section>
  );
};
