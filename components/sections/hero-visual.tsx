"use client";

import { motion, useReducedMotion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  name: string;
  image: StaticImageData;
}

interface HeroVisualProps {
  slides: readonly HeroSlide[];
  caption: string;
  slideLabel: string;
}

const SLIDE_MS = 6500;

/**
 * Wide cinematic strip of concept renders that cross-fade slowly.
 * Shows the range of classrooms; pauses on hover/focus, never autoplays for reduced motion.
 */
export const HeroVisual = ({ slides, caption, slideLabel }: HeroVisualProps): React.JSX.Element => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const playing = !paused && !reduceMotion && slides.length > 1;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [playing, active, slides.length]);

  const current = slides[active];

  return (
    <figure
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-ink-deep shadow-[0_40px_90px_-45px_rgb(23_40_61/0.55)] ring-1 ring-ink/5 sm:aspect-[16/9] lg:aspect-[21/9]">
        {slides.map((slide, index) => {
          const isActive = index === active;
          return (
            <motion.div
              key={slide.id}
              aria-hidden={!isActive}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Slow push-in while a slide is on screen; resets after it has faded out. */}
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ scale: isActive || reduceMotion ? 1 : 1.06 }}
                transition={
                  isActive
                    ? { duration: SLIDE_MS / 1000 + 1.2, ease: "linear" }
                    : { duration: 0, delay: 1.3 }
                }
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  placeholder="blur"
                  sizes="(min-width: 1320px) 1240px, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          );
        })}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-deep/25 to-transparent" />
      </div>

      <figcaption className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted" aria-live="polite">
          {caption}: <span className="font-semibold text-ink">{current.name}</span>
        </p>
        <div className="flex gap-2">
          {slides.map((slide, index) => {
            const isActive = index === active;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${slideLabel}: ${slide.name}`}
                aria-pressed={isActive}
                className="group relative h-8 w-10 sm:w-14"
              >
                <span
                  className={cn(
                    "absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full transition-colors",
                    isActive ? "bg-brand/20" : "bg-line-strong group-hover:bg-ink-muted/50",
                  )}
                >
                  {isActive && (
                    <motion.span
                      key={`${slide.id}-${playing ? "play" : "hold"}`}
                      className="absolute inset-0 origin-left rounded-full bg-brand"
                      initial={{ scaleX: playing ? 0 : 1 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: playing ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </figcaption>
    </figure>
  );
};
