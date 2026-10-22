"use client";

import Image from "next/image";
import { Check, MessageCircle, RotateCcw } from "lucide-react";

import { SheetHeading } from "@/components/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { itemKey, useOrder70Kit } from "@/hooks/use-order70-kit";
import { cn } from "@/lib/utils";

interface Order70ToolProps {
  t: Dictionary["order70"];
  items: Dictionary["cabinets"]["items"];
  sheet: string;
}

/**
 * "#order70": pick a classroom, tick what the school already has, send the rest for a quote.
 * Ticks are kept per classroom while switching tabs (state in useOrder70Kit).
 */
export const Order70Tool = ({ t, items, sheet }: Order70ToolProps): React.JSX.Element => {
  const { active, select, tabRefs, onTabKeyDown, baseId, panelId, groups, isChecked, toggle, reset, total, have, need, href } =
    useOrder70Kit({ items, templates: t.message });

  return (
    <section id="order70" aria-labelledby="order70-title" className="border-b border-line py-20 lg:py-28">
      <div className="container-axis">
        <SheetHeading id="order70-title" sheet={sheet} title={t.title} lead={t.text} />

        <div className="mt-12 border border-ink bg-surface">
          <div role="tablist" aria-label={t.tabsLabel} className="flex overflow-x-auto border-b border-line">
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
                    "flex shrink-0 items-center gap-2 border-r border-line px-4 py-3 text-sm whitespace-nowrap transition-colors",
                    selected ? "bg-ink text-white" : "text-ink-2 hover:bg-paper",
                  )}
                >
                  <span className={cn("font-mono text-[11px]", selected ? "text-brand-light" : "text-ink-faint")}>
                    {cabinets[id].code}
                  </span>
                  {items[id].name}
                </button>
              );
            })}
          </div>

          <div id={panelId} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="max-h-[36rem] overflow-y-auto px-5 pt-4 pb-6">
              <div className="label-mono flex justify-between text-ink-muted">
                <span>{items[active].name}</span>
                <span>
                  {total} {t.itemsUnit}
                </span>
              </div>
              {groups.map((group, g) => (
                <fieldset key={group.category} className="mt-6">
                  <legend className="label-mono text-ink-faint">{group.category}</legend>
                  <ul className="mt-2 divide-y divide-line border-y border-line">
                    {group.items.map((item, i) => {
                      const key = itemKey(g, i);
                      const on = isChecked(key);
                      return (
                        <li key={key}>
                          <label className="relative flex cursor-pointer items-start gap-3 py-2.5 text-[15px]">
                            {/* The real checkbox sits invisibly on top of the drawn box, so it gets the click and the focus. */}
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => toggle(key)}
                              data-name={item.name}
                              className="peer absolute top-3 left-0 m-0 size-[18px] cursor-pointer opacity-0"
                            />
                            <span
                              aria-hidden
                              className={cn(
                                "mt-0.5 grid size-[18px] shrink-0 place-items-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
                                on ? "border-brand bg-brand text-white" : "border-line-strong bg-surface",
                              )}
                            >
                              {on && <Check className="size-3" strokeWidth={3} />}
                            </span>
                            <span className={cn("flex-1 text-pretty", on ? "text-ink-faint line-through decoration-line-strong" : "text-ink")}>
                              {item.name}
                            </span>
                            <span className={cn("pt-0.5 font-mono text-[11px]", on ? "text-ok" : "text-ink-faint")}>
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

            <aside className="sticky bottom-0 border-t border-line bg-paper p-5 lg:static lg:border-t-0 lg:border-l">
              <figure className="hidden lg:block">
                <div className="relative aspect-[4/3] overflow-hidden bg-line">
                  <Image src={cabinets[active].image} alt="" fill placeholder="blur" sizes="20rem" className="object-cover" />
                </div>
                <figcaption className="mt-2 font-mono text-[11px] text-ink-faint">
                  {cabinets[active].code} · {t.previewCaption}
                </figcaption>
              </figure>
              <dl aria-live="polite" className="grid grid-cols-3 gap-px border border-line bg-line lg:mt-5">
                <div className="bg-surface p-3">
                  <dt className="label-mono text-ink-faint">{t.total}</dt>
                  <dd data-testid="order70-total" className="mt-2 text-2xl font-semibold tabular-nums">
                    {total}
                  </dd>
                </div>
                <div className="bg-surface p-3">
                  <dt className="label-mono text-ink-faint">{t.have}</dt>
                  <dd data-testid="order70-have" className="mt-2 text-2xl font-semibold text-ok tabular-nums">
                    {have}
                  </dd>
                </div>
                <div className="bg-surface p-3">
                  <dt className="label-mono text-ink-faint">{t.need}</dt>
                  <dd data-testid="order70-need" className="mt-2 text-2xl font-semibold text-brand tabular-nums">
                    {need}
                  </dd>
                </div>
              </dl>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full justify-between")}
              >
                {t.send}
                <MessageCircle aria-hidden />
              </a>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-ink-muted">{t.hint}</p>
                <button
                  type="button"
                  onClick={reset}
                  disabled={have === 0}
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-2 transition-colors hover:text-brand disabled:opacity-40"
                >
                  <RotateCcw aria-hidden className="size-3.5" />
                  {t.reset}
                </button>
              </div>
            </aside>
          </div>
        </div>
        <p className="mt-4 font-mono text-[11px] text-ink-faint">{t.sourceNote}</p>
      </div>
    </section>
  );
};
