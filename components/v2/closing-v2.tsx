"use client";

import { useId, useState } from "react";
import { ChevronDown, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Sparkle, Squiggle } from "@/components/v2/art/deco";
import { softButton } from "@/components/v2/ui/soft-button";
import { cabinetIds, isCabinetId, type CabinetId } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { site, whatsappUrl } from "@/lib/site";
import { fill } from "@/lib/template";
import { cn } from "@/lib/utils";

interface ClosingV2Props {
  t: Dictionary["contact"];
  address: string;
  items: Dictionary["cabinets"]["items"];
}

/** The big navy card at the end: choose a classroom and open WhatsApp with the request already typed. */
export const ClosingV2 = ({ t, address, items }: ClosingV2Props): React.JSX.Element => {
  const [cabinet, setCabinet] = useState<CabinetId>("informatics");
  const selectId = useId();
  const message = fill(t.messageTemplate, { cabinet: items[cabinet].name });

  return (
    <section id="contact" aria-labelledby="contact-v2-title" className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8 lg:pt-28">
      <div className="on-navy relative grid gap-10 rounded-card border-[2.5px] border-navy bg-navy p-7 text-white shadow-[0_8px_0_var(--sun)] sm:p-10 lg:grid-cols-12 lg:items-end lg:p-14">
        <Sparkle className="absolute -top-5 right-10 size-11" />
        <div className="lg:col-span-7">
          <p className="text-sm font-black tracking-wide text-sun uppercase">{t.eyebrow}</p>
          <h2 id="contact-v2-title" className="mt-4 text-[clamp(2.3rem,5.4vw,4.5rem)] leading-[0.98] font-black tracking-[-0.03em]">
            {t.title.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h2>
          <Squiggle className="mt-5 stroke-sun" />
          <p className="mt-5 max-w-[50ch] text-lg leading-relaxed font-semibold text-white/85">{t.text}</p>
          <ul className="mt-8 flex flex-col gap-3 font-bold text-white/90 sm:flex-row sm:flex-wrap sm:gap-x-7">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-2.5 rounded-md tabular-nums hover:text-sun">
                <Phone aria-hidden className="size-5 text-sun" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5 rounded-md hover:text-sun">
                <Mail aria-hidden className="size-5 text-sun" />
                {site.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2.5">
              <MapPin aria-hidden className="size-5 text-sun" />
              {address}
            </li>
          </ul>
        </div>

        <div className="on-light rounded-tile bg-white p-5 text-navy sm:p-6 lg:col-span-5">
          <label htmlFor={selectId} className="text-sm font-black tracking-wide uppercase">
            {t.selectLabel}
          </label>
          <div className="relative mt-3">
            <select
              id={selectId}
              value={cabinet}
              onChange={(event) => {
                const { value } = event.target;
                if (isCabinetId(value)) setCabinet(value);
              }}
              className="h-14 w-full appearance-none rounded-field border-[2.5px] border-navy bg-cloud pr-12 pl-4 text-base font-extrabold text-navy"
            >
              {cabinetIds.map((id) => (
                <option key={id} value={id}>
                  {items[id].name}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2" />
          </div>
          <a
            href={whatsappUrl(message)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(softButton({ size: "lg" }), "mt-4 w-full justify-between text-left sm:whitespace-normal")}
          >
            {t.submit}
            <MessageCircle aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
};
