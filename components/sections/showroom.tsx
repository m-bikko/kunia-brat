"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Box } from "lucide-react";

import { SectionTitle } from "@/components/section-title";
import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { cn } from "@/lib/utils";

export interface ShowroomTour {
  id: string;
  name: string;
  image: StaticImageData;
  tourHref: string;
}

interface ShowroomProps {
  t: Dictionary["showroom"];
  tours: readonly ShowroomTour[];
}

/**
 * Dark "see it first" block: pick a classroom, preview the concept, jump into the 3D tour.
 * The preview tilts toward the pointer to hint that the tour is interactive.
 */
export const Showroom = ({ t, tours }: ShowroomProps): React.JSX.Element => {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-6, 6]), { stiffness: 140, damping: 18 });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 18 });

  const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = (): void => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const keys: Record<string, number> = {
      ArrowDown: (index + 1) % tours.length,
      ArrowRight: (index + 1) % tours.length,
      ArrowUp: (index - 1 + tours.length) % tours.length,
      ArrowLeft: (index - 1 + tours.length) % tours.length,
      Home: 0,
      End: tours.length - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const current = tours[active];
  const panelId = `${baseId}-panel`;

  return (
    <section
      aria-labelledby="showroom-title"
      className="relative isolate overflow-hidden bg-ink-deep py-20 text-white lg:py-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(80%_70%_at_70%_40%,#000,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -top-40 right-[-10%] -z-10 size-[42rem] rounded-full bg-[radial-gradient(closest-side,rgb(48_89_223/0.35),transparent)]"
      />

      <div className="container-axis grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionTitle id="showroom-title" eyebrow={t.eyebrow} title={t.title} lead={t.text} tone="dark" />

          <div role="tablist" aria-label={t.tabsLabel} aria-orientation="vertical" className="mt-10 flex flex-col gap-2">
            {tours.map((tour, index) => {
              const selected = index === active;
              return (
                <button
                  key={tour.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`${baseId}-tab-${tour.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    "group flex items-center justify-between rounded-control border px-5 py-4 text-left text-lg font-semibold transition-colors",
                    selected
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 text-white/60 hover:border-white/20 hover:text-white",
                  )}
                >
                  {tour.name}
                  <span
                    aria-hidden
                    className={cn(
                      "h-px w-8 origin-right bg-current transition-transform duration-300",
                      selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50",
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href={current.tourHref} className={buttonVariants({ variant: "light", size: "lg" })}>
              <Box aria-hidden />
              {t.enter}
            </a>
            <p className="max-w-[34ch] text-sm leading-relaxed text-white/55">{t.hint}</p>
          </div>
        </div>

        <div
          className="lg:col-span-7 [perspective:1400px]"
          onPointerMove={onPointerMove}
          onPointerLeave={resetTilt}
        >
          <motion.div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${current.id}`}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative aspect-[4/3] overflow-hidden rounded-card bg-ink shadow-[0_50px_100px_-40px_rgb(0_0_0/0.6)] ring-1 ring-white/10"
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={current.image}
                  alt={current.name}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-card ring-1 ring-white/10 ring-inset" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
