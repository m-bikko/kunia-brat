import { ArrowUpRight, Plus } from "lucide-react";

import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";

/**
 * FAQ as soft cards (native <details>, one open at a time, works without JS), plus the
 * "Оснащение кабинета …" directory that keeps the site's internal links.
 */
export const NotesV2 = ({ t }: { t: Dictionary }): React.JSX.Element => (
  <section id="notes" aria-labelledby="notes-v2-title" className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8 lg:pt-28">
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="text-sm font-black tracking-wide text-brand uppercase">{t.faq.label}</p>
        <h2 id="notes-v2-title" className="mt-3 text-[clamp(2.1rem,4.2vw,3.25rem)] leading-[1.04] font-black tracking-[-0.025em]">
          {t.faq.title}
        </h2>
      </div>
      <ul className="grid gap-3 lg:col-span-8">
        {t.faq.items.map((item, index) => (
          <li key={item.question}>
            <details
              name="notes-v2"
              open={index === 0}
              className="group rounded-tile border-[2.5px] border-navy bg-white shadow-sticker-sm open:bg-sky"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-tile px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-lg leading-snug font-extrabold">{item.question}</span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border-[2.5px] border-navy bg-sun transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none">
                  <Plus aria-hidden className="size-4" strokeWidth={3} />
                </span>
              </summary>
              <div className="px-5 pb-5">
                <p className="max-w-[66ch] text-[17px] leading-relaxed font-semibold text-pretty text-navy-muted">{item.answer}</p>
                {item.link && (
                  <a href={item.link.href} className="mt-3 inline-flex items-center gap-1.5 rounded-md font-extrabold text-brand hover:underline">
                    {item.link.label}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>

    <nav aria-labelledby="directory-v2-title" className="mt-16 rounded-card border-[2.5px] border-navy bg-white p-6 sm:p-8">
      <h2 id="directory-v2-title" className="text-xl font-black">
        {t.faq.directoryTitle}
      </h2>
      <p className="mt-2 max-w-[62ch] font-semibold text-navy-muted">{t.faq.directoryText}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {cabinetIds.map((id) => (
          <li key={id}>
            <a
              href={cabinets[id].href}
              className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-navy bg-cloud py-1.5 pr-3 pl-1.5 text-sm font-extrabold transition-colors hover:bg-sun"
            >
              <span className="rounded-full bg-sky px-2 py-0.5 text-[11px] font-black">{cabinets[id].code}</span>
              {t.cabinets.items[id].directoryLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </section>
);
