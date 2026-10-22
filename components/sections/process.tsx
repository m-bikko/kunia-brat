"use client";

import { motion, useInView, useScroll, type Transition } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import boardLayer from "@/assets/illustrations/room-board.svg";
import decorLayer from "@/assets/illustrations/room-decor.svg";
import dimsLayer from "@/assets/illustrations/room-dims.svg";
import furniturePlanLayer from "@/assets/illustrations/room-furniture-plan.svg";
import furnitureLayer from "@/assets/illustrations/room-furniture.svg";
import screensLayer from "@/assets/illustrations/room-screens.svg";
import shellLayer from "@/assets/illustrations/room-shell.svg";
import { SheetHeading } from "@/components/sheet";
import type { Dictionary, ProcessStepCopy } from "@/content/types";
import { sitePaths } from "@/lib/site";
import { cn } from "@/lib/utils";

const ease: Transition["ease"] = [0.16, 1, 0.3, 1];

interface LayerProps {
  src: StaticImageData;
  visible: boolean;
  /** Pixels the layer drops in from when it appears. */
  rise?: number;
  delay?: number;
}

/** One transparent SVG layer of the isometric classroom, stacked on the others. */
const Layer = ({ src, visible, rise = 0, delay = 0 }: LayerProps): React.JSX.Element => (
  <motion.div
    className="absolute inset-0"
    initial={false}
    animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -rise }}
    transition={{ duration: 0.7, ease, delay: visible ? delay : 0 }}
  >
    <Image src={src} alt="" fill unoptimized className="object-contain" />
  </motion.div>
);

interface StepProps {
  index: number;
  step: ProcessStepCopy;
  active: boolean;
  onActive: (index: number) => void;
}

/** A step becomes active when it crosses the vertical middle of the viewport. */
const Step = ({ index, step, active, onActive }: StepProps): React.JSX.Element => {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li
      ref={ref}
      aria-current={active ? "step" : undefined}
      className="relative flex min-h-[46vh] flex-col justify-center py-10 pl-10 lg:min-h-[64vh] lg:pl-14"
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-0 size-3 -translate-x-[calc(50%-0.5px)] -translate-y-1/2 border-2 transition-colors duration-500",
          active ? "border-brand bg-brand" : "border-line-strong bg-surface",
        )}
      />
      <p className={cn("label-mono transition-colors duration-500", active ? "text-brand" : "text-ink-faint")}>
        {String(index + 1).padStart(2, "0")} · {step.label}
      </p>
      <h3
        className={cn(
          "mt-3 text-[clamp(1.6rem,2.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] transition-colors duration-500",
          active ? "text-ink" : "text-ink/40",
        )}
      >
        {step.title}
      </h3>
      <p
        className={cn(
          "mt-4 max-w-[46ch] text-base leading-relaxed text-pretty transition-colors duration-500 lg:text-lg",
          active ? "text-ink-muted" : "text-ink-muted/60",
        )}
      >
        {step.text}
      </p>
    </li>
  );
};

interface ProcessProps {
  t: Dictionary["process"];
  sheet: string;
}

/**
 * "#process": an empty isometric room assembles as the four steps scroll past.
 * Survey shows dimensions, design shows the plan, delivery places furniture, installation turns it on.
 */
export const Process = ({ t, sheet }: ProcessProps): React.JSX.Element => {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });

  return (
    <section id="process" aria-labelledby="process-title" className="border-b border-line bg-surface py-20 lg:py-28">
      <div className="container-axis">
        <SheetHeading id="process-title" sheet={sheet} title={t.title} />

        <div className="mt-10 grid gap-x-16 lg:mt-14 lg:grid-cols-12">
          <div className="sticky top-(--header-height) z-10 -mx-4 bg-surface px-4 pt-3 pb-4 sm:-mx-6 sm:px-6 lg:top-[calc(var(--header-height)+2.5rem)] lg:col-span-6 lg:mx-0 lg:self-start lg:p-0">
            <figure className="bg-blueprint relative overflow-hidden border border-line bg-paper">
              <div role="img" aria-label={t.illustrationAlt} className="relative mx-auto aspect-[880/650] max-h-[34vh] lg:max-h-none">
                <Layer src={shellLayer} visible />
                <Layer src={dimsLayer} visible={active === 0} />
                <Layer src={furniturePlanLayer} visible={active === 1} />
                <Layer src={furnitureLayer} visible={active >= 2} rise={18} />
                <Layer src={decorLayer} visible={active >= 2} rise={12} delay={0.15} />
                <Layer src={boardLayer} visible={active >= 3} rise={10} />
                <Layer src={screensLayer} visible={active >= 3} delay={0.25} />
              </div>
              <figcaption className="grid grid-cols-4 border-t border-line bg-surface">
                {t.steps.map((step, index) => (
                  <span
                    key={step.label}
                    className={cn(
                      "label-mono relative truncate px-2 py-3.5 text-center transition-colors duration-500",
                      index === active ? "text-brand" : "text-ink-faint",
                    )}
                  >
                    {step.label}
                    {index === active && (
                      <motion.span
                        layoutId="process-step-underline"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-brand"
                        transition={{ duration: 0.5, ease }}
                      />
                    )}
                  </span>
                ))}
              </figcaption>
            </figure>
          </div>

          <div className="relative lg:col-span-6">
            <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-line" />
            <motion.div aria-hidden className="absolute top-0 bottom-0 left-0 w-px origin-top bg-brand" style={{ scaleY: scrollYProgress }} />
            <ol ref={listRef}>
              {t.steps.map((step, index) => (
                <Step key={step.label} index={index} step={step} active={index === active} onActive={setActive} />
              ))}
            </ol>
            <a href={sitePaths.services} className="group mt-4 ml-10 inline-flex items-center gap-2 font-medium text-brand lg:ml-14">
              {t.more}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
