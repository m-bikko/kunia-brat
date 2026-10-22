"use client";

import { useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { ChevronDown, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { SectionTitle } from "@/components/section-title";
import { BorderBeam } from "@/components/ui/border-beam";
import { buttonVariants } from "@/components/ui/button";
import { cabinetIds, isCabinetId, type CabinetId } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { site, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

interface ContactCtaProps {
  t: Dictionary["contact"];
  address: string;
  cabinetItems: Dictionary["cabinets"]["items"];
}

/**
 * Closing CTA: choose a classroom, get a WhatsApp chat with the request already typed
 * in the page language. The beam on the card marks the one place to act.
 */
export const ContactCta = ({ t, address, cabinetItems }: ContactCtaProps): React.JSX.Element => {
  const [cabinet, setCabinet] = useState<CabinetId>("informatics");
  const selectId = useId();
  const reduceMotion = useReducedMotion();
  const message = t.messageTemplate.replace("{cabinet}", cabinetItems[cabinet].name);

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-blueprint relative isolate overflow-hidden bg-brand-soft py-20 lg:py-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_0%_100%,rgb(255_255_255/0.9),transparent_70%)]"
      />
      <div className="container-axis grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionTitle id="contact-title" eyebrow={t.eyebrow} title={t.title} lead={t.text} />

          <div className="mt-10">
            <p className="text-sm font-semibold text-ink-muted">{t.alternatives}</p>
            <ul className="mt-4 flex flex-col gap-3 text-ink sm:flex-row sm:flex-wrap sm:gap-x-8">
              <li>
                <a href={site.phoneHref} className="inline-flex items-center gap-2.5 font-semibold tabular-nums hover:text-brand">
                  <Phone aria-hidden className="size-4 text-brand" />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5 font-semibold hover:text-brand">
                  <Mail aria-hidden className="size-4 text-brand" />
                  {site.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-ink-muted">
                <MapPin aria-hidden className="size-4 text-brand" />
                {address}
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-card bg-surface p-6 shadow-[0_40px_80px_-40px_rgb(23_40_61/0.35)] ring-1 ring-line sm:p-8">
            {!reduceMotion && (
              <BorderBeam size={120} duration={9} colorFrom="#3059df" colorTo="#9db4f5" borderWidth={1.5} />
            )}
            <label htmlFor={selectId} className="block text-lg font-semibold text-ink">
              {t.selectLabel}
            </label>
            <div className="relative mt-4">
              <select
                id={selectId}
                value={cabinet}
                onChange={(event) => {
                  const { value } = event.target;
                  if (isCabinetId(value)) setCabinet(value);
                }}
                className="h-14 w-full appearance-none rounded-control border border-line-strong bg-surface pr-12 pl-4 text-base font-semibold text-ink transition-colors outline-none hover:border-ink-muted focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20"
              >
                {cabinetIds.map((id) => (
                  <option key={id} value={id}>
                    {cabinetItems[id].name}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-muted"
              />
            </div>
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "mt-4 h-auto min-h-14 w-full py-3 text-center whitespace-normal")}
            >
              <MessageCircle aria-hidden />
              {t.submit}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
