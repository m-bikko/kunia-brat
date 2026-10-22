import Image from "next/image";

import { SheetHeading } from "@/components/sheet";
import { brands } from "@/content/brands";
import { cabinetIds } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { plural, type Locale } from "@/lib/i18n";
import { totalItems } from "@/lib/order70";

interface FactsSuppliersProps {
  locale: Locale;
  t: Dictionary;
  sheet: string;
}

/** Four facts that are all true (no invented numbers), then the brands as a spec-sheet grid. */
export const FactsSuppliers = ({ locale, t, sheet }: FactsSuppliersProps): React.JSX.Element => {
  const positions = totalItems();
  const facts = [
    { value: String(cabinetIds.length), label: plural(locale, cabinetIds.length, t.facts.items.directions) },
    { value: String(positions), label: plural(locale, positions, t.facts.items.positions) },
    { value: String(brands.length), label: plural(locale, brands.length, t.facts.items.brands) },
    { value: t.facts.workshopValue, label: t.facts.workshopLabel },
  ];

  return (
    <section aria-labelledby="suppliers-title" className="border-b border-line py-20 lg:py-28">
      <div className="container-axis">
        <dl aria-label={t.facts.label} className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-3 bg-paper p-5 lg:p-7">
              <dt className="order-2 text-sm text-ink-muted">{fact.label}</dt>
              <dd className="order-1 text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold tracking-[-0.05em] text-ink tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <SheetHeading id="suppliers-title" sheet={sheet} title={t.brands.title} lead={t.brands.text} className="mt-20 lg:mt-28" />

        <ul className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <li key={brand.name} className="group flex h-28 items-center justify-center bg-surface px-6">
              <Image
                src={brand.logo}
                alt={brand.name}
                sizes="160px"
                unoptimized={brand.logo.src.endsWith(".svg")}
                className="max-h-11 w-auto object-contain opacity-70 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </li>
          ))}
          <li className="flex h-28 items-center bg-paper px-5 font-mono text-[11px] leading-relaxed text-ink-muted">
            {t.brands.more}
          </li>
        </ul>
      </div>
    </section>
  );
};
