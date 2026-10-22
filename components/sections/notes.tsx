import { ArrowUpRight, Plus } from "lucide-react";

import { SheetHeading } from "@/components/sheet";
import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";

interface NotesProps {
  t: Dictionary;
  sheet: string;
}

/**
 * FAQ as numbered notes to the drawing (native <details>, one open at a time, works without JS),
 * plus the "Оснащение кабинета ..." directory that keeps the site's internal links.
 */
export const Notes = ({ t, sheet }: NotesProps): React.JSX.Element => (
  <section aria-labelledby="notes-title" className="border-b border-line bg-surface py-20 lg:py-28">
    <div className="container-axis">
      <SheetHeading id="notes-title" sheet={`${sheet} · ${t.faq.label}`} title={[t.faq.title]} />

      <ol className="mt-12 border-t border-ink">
        {t.faq.items.map((item, index) => (
          <li key={item.question} className="border-b border-line">
            <details name="notes" open={index === 0} className="group">
              <summary className="grid cursor-pointer list-none grid-cols-[3rem_minmax(0,1fr)_auto] items-start gap-4 py-6 [&::-webkit-details-marker]:hidden">
                <span className="pt-1 font-mono text-xs text-brand">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-lg font-semibold text-ink transition-colors group-hover:text-brand">{item.question}</span>
                <span className="mt-0.5 grid size-8 place-items-center border border-line-strong transition-[transform,background-color,border-color,color] duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-white">
                  <Plus aria-hidden className="size-4" />
                </span>
              </summary>
              <div className="pr-12 pb-7 pl-16">
                <p className="max-w-[70ch] leading-relaxed text-pretty text-ink-muted">{item.answer}</p>
                {item.link && (
                  <a href={item.link.href} className="mt-3 inline-flex items-center gap-1.5 font-medium text-brand hover:underline">
                    {item.link.label}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>

      <nav aria-labelledby="directory-title" className="mt-16">
        <p id="directory-title" className="label-mono text-ink-faint">
          {t.faq.directoryTitle}
        </p>
        <p className="mt-2 max-w-[60ch] text-sm text-ink-muted">{t.faq.directoryText}</p>
        <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {cabinetIds.map((id) => (
            <li key={id}>
              <a
                href={cabinets[id].href}
                className="flex h-full items-center justify-between gap-3 bg-surface px-4 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white"
              >
                <span>
                  <span className="mr-2 font-mono text-[11px] text-ink-faint">{cabinets[id].code}</span>
                  {t.cabinets.items[id].directoryLabel}
                </span>
                <ArrowUpRight aria-hidden className="size-4 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </section>
);
