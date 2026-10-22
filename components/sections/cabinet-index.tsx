"use client";

import Image from "next/image";
import { useState } from "react";
import { Box, Calculator } from "lucide-react";

import { SheetHeading } from "@/components/sheet";
import { cabinetIds, cabinets, type CabinetId } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { countItems } from "@/lib/order70";
import { whatsappUrl } from "@/lib/site";
import { fill } from "@/lib/template";
import { cn } from "@/lib/utils";

interface CabinetIndexProps {
  copy: Dictionary["index"];
  items: Dictionary["cabinets"]["items"];
  tour: string;
  quote: string;
  quoteTemplate: string;
  sheet: string;
}

const columns = "lg:grid-cols-[4.5rem_minmax(0,1fr)_11rem_6.5rem_7rem]";

/** "#index": the eight classrooms as a drawing index; hovering or focusing a row swaps the preview. */
export const CabinetIndex = ({ copy, items, tour, quote, quoteTemplate, sheet }: CabinetIndexProps): React.JSX.Element => {
  const [active, setActive] = useState<CabinetId>("informatics");
  const position = cabinetIds.indexOf(active) + 1;

  return (
    <section id="index" aria-labelledby="index-title" className="border-b border-line py-20 lg:py-28">
      <div className="container-axis">
        <SheetHeading id="index-title" sheet={sheet} title={copy.title} lead={copy.hint} />

        <div className="mt-12 grid border-t border-ink lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div aria-hidden className={cn("label-mono hidden h-10 items-center border-b border-line text-ink-faint lg:grid", columns)}>
              <span className="pl-3">{copy.columns.code}</span>
              <span>{copy.columns.name}</span>
              <span>{copy.columns.key}</span>
              <span>{copy.columns.items}</span>
              <span className="pr-3 text-right">{copy.columns.action}</span>
            </div>
            <ul>
              {cabinetIds.map((id) => {
                const cabinet = cabinets[id];
                const item = items[id];
                const selected = id === active;
                return (
                  <li
                    key={id}
                    onMouseEnter={() => setActive(id)}
                    onFocusCapture={() => setActive(id)}
                    className={cn(
                      "group relative grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-y-3 border-b border-line py-4 transition-colors lg:h-[4.75rem] lg:py-0",
                      columns,
                      selected ? "bg-surface" : "hover:bg-surface",
                    )}
                  >
                    <span className={cn("pl-3 font-mono text-xs", selected ? "text-brand" : "text-ink-faint")}>{cabinet.code}</span>
                    <a
                      href={cabinet.href}
                      className="text-xl font-medium tracking-tight text-ink outline-none after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-brand lg:text-2xl"
                    >
                      {item.name}
                    </a>
                    <span className="hidden text-[13px] text-ink-muted lg:block">{item.features[0]}</span>
                    <span className="hidden font-mono text-xs text-ink-muted lg:block">
                      {countItems(id)} {copy.itemsUnit}
                    </span>
                    {cabinet.tourHref ? (
                      <a
                        href={cabinet.tourHref}
                        aria-label={`${tour}: ${item.name}`}
                        className="relative z-10 inline-flex items-center justify-end gap-1.5 pr-3 text-[13px] font-medium text-brand hover:underline"
                      >
                        <Box aria-hidden className="size-3.5" />
                        {tour}
                      </a>
                    ) : (
                      <a
                        href={whatsappUrl(fill(quoteTemplate, { cabinet: item.name }))}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${quote}: ${item.name}`}
                        className="relative z-10 inline-flex items-center justify-end gap-1.5 pr-3 text-[13px] font-medium text-ink-2 hover:text-brand"
                      >
                        <Calculator aria-hidden className="size-3.5" />
                        {quote}
                      </a>
                    )}
                    <div className="relative col-span-3 mx-3 aspect-[16/9] overflow-hidden bg-line lg:hidden">
                      <Image src={cabinet.image} alt="" fill placeholder="blur" sizes="100vw" className="object-cover" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden border-l border-line lg:col-span-5 lg:block">
            <figure className="sticky top-[calc(var(--header-height)+1.5rem)] p-6">
              <div className="relative aspect-[4/3] overflow-hidden bg-line">
                {cabinetIds.map((id) => (
                  <Image
                    key={id}
                    src={cabinets[id].image}
                    alt={id === active ? items[id].name : ""}
                    fill
                    placeholder="blur"
                    sizes="38vw"
                    className={cn("object-cover transition-opacity duration-500", id === active ? "opacity-100" : "opacity-0")}
                  />
                ))}
              </div>
              <figcaption data-testid="index-caption" className="mt-3 flex justify-between font-mono text-[11px] text-ink-muted">
                <span>
                  {cabinets[active].code} · {copy.previewCaption}
                </span>
                <span>
                  {String(position).padStart(2, "0")} / {String(cabinetIds.length).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
