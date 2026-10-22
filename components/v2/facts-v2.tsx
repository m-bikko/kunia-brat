import Image from "next/image";

import { brands } from "@/content/brands";
import { cabinetIds } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { plural, type Locale } from "@/lib/i18n";
import { totalItems } from "@/lib/order70";
import { cn } from "@/lib/utils";

const bubbles = ["bg-brand text-white", "bg-sun", "bg-coral", "bg-white"] as const;

/** Real numbers in four bubbles, then the brand logos in rounded tiles. */
export const FactsV2 = ({ locale, t }: { locale: Locale; t: Dictionary }): React.JSX.Element => {
  const positions = totalItems();
  const facts = [
    { value: String(cabinetIds.length), label: plural(locale, cabinetIds.length, t.facts.items.directions) },
    { value: String(positions), label: plural(locale, positions, t.facts.items.positions) },
    { value: String(brands.length), label: plural(locale, brands.length, t.facts.items.brands) },
    { value: t.facts.workshopValue, label: t.facts.workshopLabel },
  ];

  return (
    <section aria-labelledby="brands-v2-title" className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8 lg:pt-28">
      <dl aria-label={t.facts.label} className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={cn("rounded-card border-[2.5px] border-navy p-5 shadow-sticker sm:p-7", bubbles[index], index % 2 === 1 && "lg:translate-y-4")}
          >
            <dt className="sr-only">{fact.label}</dt>
            <dd className="text-[clamp(2.5rem,5vw,4rem)] leading-none font-black tracking-[-0.03em] tabular-nums">{fact.value}</dd>
            <dd aria-hidden className="mt-3 text-[15px] leading-snug font-extrabold">
              {fact.label}
            </dd>
          </div>
        ))}
      </dl>

      <div id="brands" className="mt-24 grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 id="brands-v2-title" className="text-[clamp(2.1rem,4.6vw,3.75rem)] leading-[1.02] font-black tracking-[-0.025em] lg:col-span-7">
          {t.brands.title.map((line) => (
            <span key={line} className="block">
              {line}{" "}
            </span>
          ))}
        </h2>
        <p className="max-w-[46ch] text-lg leading-relaxed font-semibold text-navy-muted lg:col-span-5">{t.brands.text}</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:col-span-12 lg:mt-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <li
              key={brand.name}
              className="group grid h-24 place-items-center rounded-tile border-[2.5px] border-navy bg-white px-5 shadow-sticker-sm sm:h-28"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                sizes="10rem"
                unoptimized={brand.logo.src.endsWith(".svg")}
                className={cn(
                  "max-h-11 w-auto object-contain opacity-80 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0",
                  brand.invert && "invert",
                )}
              />
            </li>
          ))}
          <li className="grid h-24 place-items-center rounded-tile border-[2.5px] border-dashed border-navy bg-sky px-4 text-center text-sm leading-snug font-extrabold sm:h-28">
            {t.brands.more}
          </li>
        </ul>
      </div>
    </section>
  );
};
