import { ArrowUpRight, Plus } from "lucide-react";

import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";

interface FaqProps {
  t: Dictionary;
}

/**
 * Questions from the live page's SEO block, as a native <details> accordion (works without JS),
 * plus the "Оснащение кабинета ..." directory that keeps the site's internal links.
 */
export const Faq = ({ t }: FaqProps): React.JSX.Element => {
  const copy = t.faq;

  return (
    <section aria-labelledby="faq-title" className="bg-surface py-20 lg:py-28">
      <div className="container-axis grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2
            id="faq-title"
            className="text-[clamp(2.1rem,4.2vw,3.4rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance text-ink lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]"
          >
            {copy.title}
          </h2>
        </div>

        <div className="lg:col-span-7">
          <div className="divide-y divide-line border-y border-line">
            {copy.items.map((item, index) => (
              <details key={item.question} name="faq" open={index === 0} className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left text-lg font-semibold text-ink transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line-strong transition-[transform,background-color,border-color] duration-300 group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-white">
                    <Plus aria-hidden className="size-4" />
                  </span>
                </summary>
                <div className="pr-14 pb-7">
                  <p className="leading-relaxed text-pretty text-ink-muted">{item.answer}</p>
                  {item.link && (
                    <a
                      href={item.link.href}
                      className="group/link mt-3 inline-flex items-center gap-1.5 font-semibold text-brand"
                    >
                      {item.link.label}
                      <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>

        <nav aria-labelledby="directory-title" className="lg:col-span-12">
          <div className="rounded-card bg-paper p-6 sm:p-8 lg:p-10">
            <h3 id="directory-title" className="text-xl font-semibold tracking-[-0.02em] text-ink">
              {copy.directoryTitle}
            </h3>
            <p className="mt-2 max-w-[60ch] text-ink-muted">{copy.directoryText}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {cabinetIds.map((id) => (
                <li key={id}>
                  <a
                    href={cabinets[id].href}
                    className="group flex h-full items-center justify-between gap-3 rounded-control bg-surface px-4 py-3.5 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-brand hover:text-white"
                  >
                    {t.cabinets.items[id].directoryLabel}
                    <ArrowUpRight aria-hidden className="size-4 shrink-0 text-brand transition-colors group-hover:text-white" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </section>
  );
};
