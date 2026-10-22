"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import { ClassroomArt, type ClassroomStage } from "@/components/v2/art/classroom";
import { Sticker } from "@/components/v2/ui/sticker";
import type { Dictionary } from "@/content/types";
import { sitePaths } from "@/lib/site";
import { cn } from "@/lib/utils";

const stages: readonly ClassroomStage[] = [0, 1, 2, 3];
const badges = ["bg-brand text-white", "bg-sun text-navy", "bg-coral text-navy", "bg-navy text-white"] as const;

/**
 * "#process" of v2: four step cards, and the first-screen classroom assembling with them (empty room →
 * furniture → equipment → ready). On desktop one art sticks beside the steps and follows the step in view;
 * on phones every card carries its own state.
 */
export const ProcessV2 = ({ t, states }: { t: Dictionary["process"]; states: Dictionary["v2"]["process"]["states"] }): React.JSX.Element => {
  const [active, setActive] = useState<ClassroomStage>(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = stepRefs.current.findIndex((node) => node === entry.target);
          const stage = stages[index];
          if (entry.isIntersecting && stage !== undefined) setActive(stage);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" aria-labelledby="process-v2-title" className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8 lg:pt-28">
      <h2 id="process-v2-title" className="max-w-[18ch] text-[clamp(2.1rem,4.6vw,3.75rem)] leading-[1.02] font-black tracking-[-0.025em]">
        {t.title.map((line) => (
          <span key={line} className="block">
            {line}{" "}
          </span>
        ))}
      </h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-28 rounded-card border-[2.5px] border-navy bg-sky p-5 shadow-sticker">
            <div data-stage={active} role="img" aria-label={states[active]} className="v2-stages">
              <ClassroomArt />
            </div>
            <Sticker tone="white" className="mt-4">
              {states[active]}
            </Sticker>
          </div>
        </div>

        <ol className="grid gap-5 lg:col-span-6 lg:gap-8 lg:py-[12vh]">
          {t.steps.map((step, index) => (
            <li
              key={step.label}
              ref={(node) => {
                stepRefs.current[index] = node;
              }}
              data-step={index}
              className={cn(
                "rounded-card border-[2.5px] border-navy bg-white p-6 shadow-sticker transition-transform duration-300 sm:p-7 lg:min-h-[30vh]",
                active === index && "lg:-translate-y-1",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-full border-[2.5px] border-navy text-lg font-black",
                    badges[index],
                  )}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-black tracking-wide text-navy-muted uppercase">{step.label}</span>
              </div>
              <h3 className="mt-4 text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-black">{step.title}</h3>
              <p className="mt-3 text-lg leading-relaxed font-semibold text-navy-muted">{step.text}</p>
              <div data-stage={index} className="mt-5 rounded-tile border-[2.5px] border-navy bg-sky p-3 lg:hidden">
                <ClassroomArt stage={stages[index]} />
              </div>
            </li>
          ))}
        </ol>
      </div>

      <a href={sitePaths.services} className="mt-8 inline-flex items-center gap-2 rounded-full text-lg font-extrabold text-brand hover:underline">
        {t.more}
        <ArrowRight aria-hidden className="size-5" />
      </a>
    </section>
  );
};
