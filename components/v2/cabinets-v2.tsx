import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { CabinetIcon } from "@/components/v2/art/cabinet-icons";
import { Sticker } from "@/components/v2/ui/sticker";
import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { plural, type Locale } from "@/lib/i18n";
import { countItems } from "@/lib/order70";
import { whatsappUrl } from "@/lib/site";
import { fill } from "@/lib/template";

interface CabinetsV2Props {
  locale: Locale;
  t: Dictionary;
}

const chipClass =
  "inline-flex items-center gap-1 rounded-full border-[2.5px] border-navy px-2.5 py-1 text-xs font-extrabold transition-colors sm:px-3 sm:text-sm";

/**
 * "#index" of v2: eight sticker cards, each with its own spot illustration. Hover or keyboard focus swaps
 * the drawing for the concept render; the name links to the cabinet page, chips to the 3D tour and a quote.
 */
export const CabinetsV2 = ({ locale, t }: CabinetsV2Props): React.JSX.Element => (
  <section id="index" aria-labelledby="index-v2-title" className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8 lg:pt-28">
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <h2 id="index-v2-title" className="text-[clamp(2.1rem,4.6vw,3.75rem)] leading-[1.02] font-black tracking-[-0.025em] lg:col-span-7">
        {t.index.title.map((line) => (
          <span key={line} className="block">
            {line}{" "}
          </span>
        ))}
      </h2>
      <p className="hidden max-w-[44ch] text-lg leading-relaxed font-semibold text-navy-muted lg:col-span-5 [@media(hover:hover)]:block">{t.v2.index.hint}</p>
    </div>

    <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {cabinetIds.map((id) => {
        const cabinet = cabinets[id];
        const item = t.cabinets.items[id];
        const count = countItems(id);
        return (
          <li
            key={id}
            data-cabinet={id}
            className="group relative flex flex-col rounded-tile border-[2.5px] border-navy bg-white p-2.5 shadow-sticker-sm transition-transform duration-300 ease-out sm:rounded-card sm:p-4 sm:shadow-sticker motion-safe:focus-within:-translate-y-1 motion-safe:hover:-translate-y-1 motion-safe:hover:-rotate-[0.6deg]"
          >
            <div className="relative aspect-[4/3] overflow-clip rounded-tile border-[2.5px] border-navy bg-cloud">
              <CabinetIcon
                id={id}
                className="absolute inset-0 m-auto size-[76%] transition-opacity duration-300 group-focus-within:opacity-0 group-hover:opacity-0"
              />
              {/* Hover-only: not rendered (so never downloaded) on touch screens. */}
              <div className="absolute inset-0 hidden [@media(hover:hover)]:block">
                <Image
                  src={cabinet.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 18rem, 45vw"
                  className="object-cover opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
                />
              </div>
              <Sticker tone="sun" className="absolute top-2 left-2 px-2 text-[11px] sm:top-3 sm:left-3 sm:px-2.5 sm:text-xs">
                {cabinet.code}
              </Sticker>
            </div>
            <h3 className="mt-3 text-base leading-tight font-black [overflow-wrap:anywhere] sm:mt-4 sm:text-xl">
              <a href={cabinet.href} className="rounded-md hover:text-brand">
                {item.name}
              </a>
            </h3>
            <p className="mt-1.5 hidden text-[15px] leading-snug font-semibold text-navy-muted sm:block">{item.features[0]}</p>
            <p className="mt-2 text-[13px] leading-snug font-extrabold sm:mt-3 sm:text-sm">{fill(plural(locale, count, t.v2.index.items), { n: count })}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-3 sm:gap-2 sm:pt-4">
              {cabinet.tourHref && (
                <a href={cabinet.tourHref} aria-label={`${t.cabinets.tour}: ${item.name}`} className={`${chipClass} bg-sky hover:bg-sun`}>
                  {t.cabinets.tour}
                  <ArrowUpRight aria-hidden className="size-4" />
                </a>
              )}
              <a
                href={whatsappUrl(fill(t.contact.messageTemplate, { cabinet: item.name }))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.cabinets.quote}: ${item.name}`}
                className={`${chipClass} bg-white hover:bg-sky`}
              >
                {t.cabinets.quote}
              </a>
            </div>
          </li>
        );
      })}
    </ul>
    <p className="mt-4 hidden px-2 text-sm font-semibold text-navy-muted [@media(hover:hover)]:block">{t.index.previewCaption}</p>
  </section>
);
