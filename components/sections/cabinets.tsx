import { ArrowUpRight, Box, Check, Calculator } from "lucide-react";
import Image from "next/image";

import { SectionTitle } from "@/components/section-title";
import { BlurFade } from "@/components/ui/blur-fade";
import { cabinets, languageCabinetIds, type CabinetId } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

type TileSize = "feature" | "wide" | "compact";

interface Layout {
  id: CabinetId;
  size: TileSize;
  className: string;
}

/** Bento rhythm: one feature tile, two wide, two compact, then the grouped language tile. */
const layout: readonly Layout[] = [
  { id: "informatics", size: "feature", className: "sm:col-span-2 lg:row-span-2" },
  { id: "art", size: "wide", className: "sm:col-span-2" },
  { id: "sewing", size: "compact", className: "" },
  { id: "pottery", size: "compact", className: "" },
  { id: "workshop", size: "wide", className: "sm:col-span-2" },
];

const sizes: Record<TileSize, string> = {
  feature: "(min-width: 1024px) 50vw, 100vw",
  wide: "(min-width: 1024px) 50vw, 100vw",
  compact: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
};

const tileBase =
  "group relative isolate flex h-full min-h-[21rem] flex-col justify-end overflow-hidden rounded-card bg-ink-deep text-white lg:min-h-0";

const scrim = "absolute inset-0 -z-10 bg-gradient-to-t from-ink-deep/92 via-ink-deep/40 to-ink-deep/0";

const imageMotion =
  "-z-20 object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.045]";

const actionChip =
  "relative z-10 inline-flex items-center gap-1.5 rounded-full bg-white/14 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-ink";

interface CabinetsProps {
  t: Dictionary;
}

/** "#solutions": the eight directions as a bento grid of concept renders. */
export const Cabinets = ({ t }: CabinetsProps): React.JSX.Element => {
  const copy = t.cabinets;

  return (
    <section id="solutions" aria-labelledby="solutions-title" className="py-20 lg:py-28">
      <div className="container-axis">
        <SectionTitle id="solutions-title" title={copy.title} lead={copy.lead} />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:auto-rows-[20rem] lg:grid-cols-4">
          {layout.map(({ id, size, className }, index) => {
            const cabinet = cabinets[id];
            const item = copy.items[id];
            const quoteText = t.contact.messageTemplate.replace("{cabinet}", item.name);

            return (
              <BlurFade key={id} inView direction="up" offset={14} delay={index * 0.06} className={className}>
                <article className={cn(tileBase, size === "feature" && "min-h-[30rem] lg:min-h-0")}>
                  <Image src={cabinet.image} alt="" fill placeholder="blur" sizes={sizes[size]} className={imageMotion} />
                  <div className={scrim} />
                  <span
                    aria-hidden
                    className="absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-white group-hover:text-ink"
                  >
                    <ArrowUpRight className="size-[1.1rem]" />
                  </span>

                  <div className={cn("p-6", size === "feature" && "lg:p-9")}>
                    <p className="text-[0.82rem] font-semibold text-white/70">{copy.categories[cabinet.category]}</p>
                    <h3
                      className={cn(
                        "mt-1.5 font-semibold tracking-[-0.02em] text-balance",
                        size === "feature" ? "text-3xl lg:text-[2.6rem] lg:leading-[1.05]" : "text-2xl",
                      )}
                    >
                      {/* Stretched link: the whole tile opens the cabinet page. */}
                      <a href={cabinet.href} className="outline-none after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-[-4px] focus-visible:after:outline-white">
                        {item.name}
                      </a>
                    </h3>

                    {size !== "compact" && (
                      <p className="mt-3 max-w-[48ch] text-[0.95rem] leading-relaxed text-white/80 text-pretty">{item.text}</p>
                    )}

                    {size === "feature" && (
                      <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
                        {item.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm font-medium text-white/90">
                            <Check aria-hidden className="size-4 shrink-0 text-brand-light" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {cabinet.tourHref ? (
                        <a href={cabinet.tourHref} className={actionChip} aria-label={`${copy.tour}: ${item.name}`}>
                          <Box aria-hidden className="size-4" />
                          {copy.tour}
                        </a>
                      ) : (
                        <a
                          href={whatsappUrl(quoteText)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={actionChip}
                          aria-label={`${copy.quote}: ${item.name}`}
                        >
                          <Calculator aria-hidden className="size-4" />
                          {copy.quote}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </BlurFade>
            );
          })}

          <BlurFade inView direction="up" offset={14} delay={layout.length * 0.06} className="sm:col-span-2">
            <article className={tileBase}>
              <Image
                src={cabinets.kazakh.image}
                alt=""
                fill
                placeholder="blur"
                sizes={sizes.wide}
                className={imageMotion}
              />
              <div className={scrim} />
              <div className="p-6">
                <p className="text-[0.82rem] font-semibold text-white/70">{copy.categories.languages}</p>
                <h3 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em]">{copy.languagesTitle}</h3>
                <p className="mt-3 max-w-[48ch] text-[0.95rem] leading-relaxed text-white/80 text-pretty">
                  {copy.languagesText}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {languageCabinetIds.map((id) => (
                    <li key={id}>
                      <a href={cabinets[id].href} className={actionChip} aria-label={copy.items[id].name}>
                        {copy.languagesLinks[id]}
                        <ArrowUpRight aria-hidden className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </BlurFade>
        </div>
      </div>
    </section>
  );
};
