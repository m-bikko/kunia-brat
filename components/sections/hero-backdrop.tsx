"use client";

import { useReducedMotion } from "motion/react";

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

/**
 * Blueprint grid behind the hero. A few cells light up and fade, like a plan being drafted.
 * Static grid only for reduced-motion users.
 */
export const HeroBackdrop = (): React.JSX.Element => {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_0%,rgb(48_89_223/0.12),transparent_70%)]" />
      <div className="bg-blueprint absolute inset-0 [mask-image:radial-gradient(90%_55%_at_80%_0%,#000_10%,transparent_70%)] lg:hidden" />
      <AnimatedGridPattern
        width={48}
        height={48}
        numSquares={reduceMotion ? 0 : 16}
        maxOpacity={0.14}
        duration={3.5}
        repeatDelay={1.5}
        className="hidden stroke-brand/12 text-brand lg:block [mask-image:radial-gradient(55%_65%_at_92%_0%,#000_15%,transparent_70%)]"
      />
    </div>
  );
};
