"use client";

import { animate } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

import { INTRO } from "@/components/intro/timeline";
import type { Dictionary } from "@/content/types";
import { introHandoff, isIntroKind, landsExactly, type SiteVersion } from "@/lib/intro";

declare global {
  interface Window {
    /** performance.now() when the boot script started the intro. */
    __axisIntroStart?: number;
    /** The boot script's failsafe timer; cleared once the controller runs the intro. */
    __axisIntroTimer?: number;
  }
}

const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/**
 * The intro overlay and its controller, shared by every kind. Scenes (children) are server-rendered CSS
 * timelines that start before hydration; the boot script decides whether and which one shows. This
 * component adds skipping, the hand-off (flight into `[data-intro-target]` or the scene's own reveal)
 * and owns the failsafe once it takes over.
 */
export const IntroStage = ({
  version,
  t,
  children,
}: {
  version: SiteVersion;
  t: Dictionary["intro"];
  children: ReactNode;
}): React.JSX.Element => {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    const kind = html.getAttribute("data-intro-kind");
    if (!root || html.getAttribute("data-intro") !== "play" || !isIntroKind(kind)) return;

    // JS arrived after the CSS failsafe exit began: let it finish (the boot timer ends the intro)
    // instead of cancelling it, which would snap the faded overlay back.
    const start = window.__axisIntroStart ?? performance.now();
    const elapsed = (): number => performance.now() - start;
    if (elapsed() >= INTRO.failsafeAt) return;

    window.clearTimeout(window.__axisIntroTimer);
    root.dataset.js = "";
    const scene = root.querySelector<HTMLElement>(`.intro-scene[data-kind="${kind}"]`);
    const controller = new AbortController();
    const timers: number[] = [];

    const end = (): void => {
      controller.abort();
      html.removeAttribute("data-intro");
    };

    const skip = (): void => {
      if (html.getAttribute("data-intro") !== "play") return;
      html.setAttribute("data-intro", "skip");
      timers.push(window.setTimeout(end, 300));
    };
    skipRef.current = skip;

    const fadeOut = (): void => {
      animate(root, { opacity: 0 }, { duration: 0.5 }).then(end);
    };

    const handOff = (): void => {
      if (html.getAttribute("data-intro") !== "play") return;
      if (introHandoff[kind] === "reveal") {
        timers.push(window.setTimeout(end, Math.max(0, INTRO.revealEndMs - elapsed())));
        return;
      }

      const subject = scene?.querySelector<HTMLElement>("[data-intro-subject]");
      const from = subject?.getBoundingClientRect();
      const to = document.querySelector("[data-intro-target]")?.getBoundingClientRect();
      const onScreen = to !== undefined && to.top >= 0 && to.bottom <= window.innerHeight && window.innerWidth >= 1024;
      if (!subject || !from || !to || !onScreen || from.width === 0) {
        fadeOut();
        return;
      }

      const duration = INTRO.flightMs / 1000;
      subject.style.transformOrigin = "0 0";
      animate(
        subject,
        { x: to.left - from.left, y: to.top - from.top, scale: to.width / from.width },
        { duration, ease: EASE_IN_OUT },
      );
      // A different-looking first screen: the scene's room dissolves as it lands.
      if (!landsExactly(version, kind)) animate(subject, { opacity: 0 }, { duration: 0.3, delay: duration - 0.3 });
      const background = scene?.querySelector<HTMLElement>("[data-intro-bg]");
      if (background) animate(background, { opacity: 0 }, { duration: 0.6, delay: 0.2 });
      root.querySelectorAll<HTMLElement>("[data-intro-chrome]").forEach((node) => {
        animate(node, { opacity: 0 }, { duration: 0.3 });
      });
      timers.push(window.setTimeout(end, INTRO.flightMs + 60));
    };

    timers.push(window.setTimeout(handOff, Math.max(0, INTRO.flightAt - elapsed())));
    // This run owns the end now; keep a failsafe of its own in case the hand-off never completes.
    timers.push(window.setTimeout(end, Math.max(0, INTRO.flightAt + INTRO.flightMs + 1000 - elapsed())));

    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey, { signal: controller.signal });
    window.addEventListener("wheel", skip, { passive: true, signal: controller.signal });
    window.addEventListener("touchmove", skip, { passive: true, signal: controller.signal });

    // Cleanup only stops this run (React Strict Mode re-runs effects in development).
    return () => {
      controller.abort();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [version]);

  return (
    <div ref={rootRef} className="intro">
      {children}
      <button
        type="button"
        data-intro-chrome
        onClick={() => skipRef.current()}
        className={
          version === "v1"
            ? "absolute bottom-8 left-1/2 -translate-x-1/2 bg-ink/85 px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] text-white uppercase transition-colors hover:bg-ink"
            : "absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border-[2.5px] border-white bg-white/10 px-5 py-2 text-sm font-extrabold text-white transition-colors hover:bg-white/20"
        }
      >
        {t.skip}
      </button>
    </div>
  );
};
