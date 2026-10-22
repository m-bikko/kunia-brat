import { Sticker } from "@/components/v2/ui/sticker";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";

const badges = ["bg-brand text-white", "bg-sun text-navy", "bg-coral text-navy", "bg-navy text-white"] as const;

/** Four stages of the work as round numbered badges on a wavy dotted path. */
export const StagesV2 = ({ t }: { t: Dictionary["stages"] }): React.JSX.Element => (
  <section id="stages" aria-labelledby="stages-v2-title" className="mx-auto max-w-[1240px] px-5 sm:px-8">
    <div className="rounded-card border-[2.5px] border-navy bg-white p-6 shadow-sticker sm:p-8">
      <h2 id="stages-v2-title">
        <Sticker tone="sky">{t.label}</Sticker>
      </h2>
      <ol className="relative mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <svg
          viewBox="0 0 1000 40"
          preserveAspectRatio="none"
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-2 hidden h-10 w-[calc(100%-4rem)] lg:block"
          fill="none"
        >
          <path
            d="M0 20q62-28 125 0t125 0t125 0t125 0t125 0t125 0t125 0t125 0"
            stroke="var(--navy)"
            strokeWidth={3}
            strokeDasharray="2 12"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {t.items.map((item, index) => (
          <li key={item.label} className="relative flex items-start gap-4 lg:flex-col">
            <span
              aria-hidden
              className={cn(
                "grid size-14 shrink-0 place-items-center rounded-full border-[2.5px] border-navy text-xl font-black shadow-sticker-sm",
                badges[index],
              )}
            >
              {index + 1}
            </span>
            <div>
              <p className="text-lg leading-tight font-black">{item.label}</p>
              <p className="mt-1.5 leading-snug font-semibold text-navy-muted">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
