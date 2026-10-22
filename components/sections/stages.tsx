import type { Dictionary } from "@/content/types";

/** The four stages as a ruler right under the first screen. Hairlines come from the 1px grid gap. */
export const Stages = ({ t }: { t: Dictionary["stages"] }): React.JSX.Element => (
  <section aria-label={t.label} className="border-b border-line">
    <div className="container-axis">
      <ol className="grid gap-px border-x border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {t.items.map((stage) => (
          <li key={stage.label} className="bg-paper px-5 py-6 lg:px-6">
            <p className="label-mono text-brand">→ {stage.label}</p>
            <p className="mt-2.5 text-[15px] text-ink">{stage.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
