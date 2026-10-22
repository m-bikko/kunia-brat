"use client";

import { useId, useState } from "react";
import { ChevronDown, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cabinetIds, isCabinetId, type CabinetId } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { site, whatsappUrl } from "@/lib/site";
import { fill } from "@/lib/template";
import { cn } from "@/lib/utils";

interface ClosingProps {
  t: Dictionary["contact"];
  address: string;
  items: Dictionary["cabinets"]["items"];
  sheet: string;
}

/** The one dark sheet: choose a classroom and open WhatsApp with the request already typed. */
export const Closing = ({ t, address, items, sheet }: ClosingProps): React.JSX.Element => {
  const [cabinet, setCabinet] = useState<CabinetId>("informatics");
  const selectId = useId();
  const message = fill(t.messageTemplate, { cabinet: items[cabinet].name });

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ink py-20 text-white lg:py-28">
      <div className="container-axis grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label-mono text-brand-light">
            {sheet} · {t.eyebrow}
          </p>
          <h2 id="contact-title" className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
            {t.title.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-pretty text-white/70">{t.text}</p>
          <ul className="mt-10 flex flex-col gap-3 text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-8">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-2.5 font-medium tabular-nums hover:text-white">
                <Phone aria-hidden className="size-4 text-brand-light" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5 font-medium hover:text-white">
                <Mail aria-hidden className="size-4 text-brand-light" />
                {site.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2.5 text-white/60">
              <MapPin aria-hidden className="size-4 text-brand-light" />
              {address}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-white/20 bg-white/[0.04] p-6 sm:p-8">
            <label htmlFor={selectId} className="label-mono text-white/60">
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
                className="h-14 w-full appearance-none border border-white/25 bg-ink pr-12 pl-4 text-base font-medium text-white outline-none hover:border-white/50 focus-visible:border-brand-light"
              >
                {cabinetIds.map((id) => (
                  <option key={id} value={id}>
                    {items[id].name}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-white/60" />
            </div>
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "mt-4 h-auto min-h-14 w-full justify-between py-3 text-left whitespace-normal")}
            >
              {t.submit}
              <MessageCircle aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
