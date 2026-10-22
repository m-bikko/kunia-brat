import { ArrowUpRight } from "lucide-react";

import { softButton } from "@/components/v2/ui/soft-button";
import type { Dictionary } from "@/content/types";
import { site } from "@/lib/site";

/** Cross-promo for G8, the sister site for school sports equipment, as a sticker card with a ball. */
export const G8V2 = ({ t }: { t: Dictionary["g8"] }): React.JSX.Element => (
  <section aria-labelledby="g8-v2-title" className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8 lg:pt-28">
    <div className="grid overflow-clip rounded-card border-[2.5px] border-navy bg-white shadow-sticker lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="p-7 sm:p-10">
        <h2 id="g8-v2-title" className="text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.05] font-black tracking-[-0.02em]">
          {t.title.map((line) => (
            <span key={line} className="block">
              {line}{" "}
            </span>
          ))}
        </h2>
        <p className="mt-4 max-w-[56ch] text-[17px] leading-relaxed font-semibold text-navy-muted">{t.text}</p>
        <a href={site.g8Url} target="_blank" rel="noopener" className={softButton({ variant: "outline", className: "mt-7" })}>
          {t.cta}
          <ArrowUpRight aria-hidden />
        </a>
      </div>
      <div aria-hidden className="relative grid min-h-56 place-items-center border-t-[2.5px] border-navy bg-coral lg:border-t-0 lg:border-l-[2.5px]">
        <svg viewBox="0 0 160 160" className="size-40" fill="none" stroke="var(--navy)" strokeWidth={3} strokeLinejoin="round">
          <circle cx={80} cy={80} r={54} fill="#ffffff" />
          <path d="M80 54l22 16l-8 26H66l-8-26Z" fill="var(--navy)" />
          <path d="M80 26v28M102 70l26-8M94 96l16 24M66 96l-16 24M58 70l-26-8" />
        </svg>
        <span className="absolute top-5 left-6 rounded-full border-[2.5px] border-navy bg-sun px-3 py-1 text-2xl font-black">G8</span>
      </div>
    </div>
  </section>
);
