"use client";

import { animate } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import boardLayer from "@/assets/illustrations/room-board.svg";
import decorLayer from "@/assets/illustrations/room-decor.svg";
import furnitureOutline from "@/assets/illustrations/room-furniture-outline.svg";
import furnitureLayer from "@/assets/illustrations/room-furniture.svg";
import screensLayer from "@/assets/illustrations/room-screens.svg";
import shellLayer from "@/assets/illustrations/room-shell.svg";
import { roomDetailPaths, roomDimPaths, roomGridPaths, roomStructurePaths } from "@/components/intro/room-outline";
import { INTRO } from "@/components/intro/timeline";
import type { Dictionary } from "@/content/types";

declare global {
  interface Window {
    /** performance.now() when the boot script started the intro. */
    __axisIntroStart?: number;
    /** The boot script's failsafe timer; cleared once this component runs the intro. */
    __axisIntroTimer?: number;
  }
}

const colorLayers = [
  { src: shellLayer, at: "2.7s" },
  { src: furnitureLayer, at: "2.9s" },
  { src: decorLayer, at: "3s" },
  { src: boardLayer, at: "3.1s" },
  { src: screensLayer, at: "3.2s" },
] as const;

const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/**
 * Blueprint intro: logo corner → X/Y axes → classroom in white lines → develops into colour → flies
 * into the first screen's sketch. The timeline is CSS (it starts before hydration); this component
 * adds skipping and the measured flight. It only renders markup; the boot script decides if it shows.
 */
export const BlueprintIntro = ({ t }: { t: Dictionary["intro"] }): React.JSX.Element => {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    if (!root || html.getAttribute("data-intro") !== "play") return;

    // JS arrived after the CSS failsafe exit began: let it finish (the boot timer ends the intro)
    // instead of cancelling it, which would snap the faded overlay back.
    const elapsed = performance.now() - (window.__axisIntroStart ?? performance.now());
    if (elapsed >= INTRO.failsafeAt) return;

    window.clearTimeout(window.__axisIntroTimer);
    root.dataset.js = "";
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

    const fly = (): void => {
      if (html.getAttribute("data-intro") !== "play") return;
      const room = roomRef.current;
      const from = room?.getBoundingClientRect();
      const to = document.querySelector("[data-plan-target]")?.getBoundingClientRect();
      const onScreen = to !== undefined && to.top >= 0 && to.bottom <= window.innerHeight && window.innerWidth >= 1024;

      if (room && from && to && onScreen) {
        room.style.transformOrigin = "0 0";
        animate(
          room,
          { x: to.left - from.left, y: to.top - from.top, scale: to.width / from.width },
          { duration: INTRO.flightMs / 1000, ease: EASE_IN_OUT },
        );
        if (bgRef.current) animate(bgRef.current, { opacity: 0 }, { duration: 0.6, delay: 0.2 });
        timers.push(window.setTimeout(end, INTRO.flightMs + 60));
      } else {
        animate(root, { opacity: 0 }, { duration: 0.5 }).then(end);
      }
    };

    timers.push(window.setTimeout(fly, Math.max(0, INTRO.flightAt - elapsed)));
    // This run now owns the end; keep a failsafe of its own in case the flight never completes.
    timers.push(window.setTimeout(end, Math.max(0, INTRO.flightAt + INTRO.flightMs + 1000 - elapsed)));

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
  }, []);

  return (
    <div ref={rootRef} className="intro">
      <div ref={bgRef} className="intro-bg" />
      <div aria-hidden className="intro-grid" />

      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="intro-out-at absolute inset-0" style={{ "--out": "2.6s" }}>
          <div className="intro-grow-x absolute top-1/2 left-1/2 h-[1.5px] w-1/2 bg-white/80" />
          <div className="intro-grow-y absolute bottom-1/2 left-1/2 h-1/2 w-[1.5px] bg-white/80" />
          <span className="intro-in absolute top-1/2 right-6 mt-3 font-mono text-xs text-white/80" style={{ "--at": "1.2s" }}>
            X
          </span>
          <span className="intro-in absolute top-6 left-1/2 ml-3 font-mono text-xs text-white/80" style={{ "--at": "1.2s" }}>
            Y
          </span>
        </div>

        <div className="intro-out-at absolute top-1/2 left-1/2 -translate-y-full" style={{ "--out": "1.4s" }}>
          <div className="intro-pop relative size-12 border-b-[5px] border-l-[5px] border-white" style={{ "--at": "0.1s" }}>
            <span className="absolute bottom-1.5 left-1.5 size-2.5 bg-brand-light" />
          </div>
        </div>

        <div className="absolute inset-0 grid place-items-center">
          <div ref={roomRef} className="relative aspect-[880/650] w-[min(80vw,54rem)]">
            <svg viewBox="0 0 880 650" className="absolute inset-0 size-full overflow-visible">
              <g fill="none" stroke="white" strokeLinejoin="round" className="intro-out-at" style={{ "--out": "2.75s" }}>
                {roomStructurePaths.map((d, index) => (
                  <path key={d} d={d} pathLength={1} strokeWidth={1.6} className="intro-draw" style={{ "--at": `${1.4 + index * 0.12}s`, "--dur": "0.6s" }} />
                ))}
                {roomGridPaths.map((d, index) => (
                  <path key={d} d={d} pathLength={1} strokeWidth={0.8} strokeOpacity={0.35} className="intro-draw" style={{ "--at": `${1.8 + index * 0.03}s`, "--dur": "0.4s" }} />
                ))}
                {roomDetailPaths.map((d, index) => (
                  <path key={d} d={d} pathLength={1} strokeWidth={1.2} className="intro-draw" style={{ "--at": `${1.9 + index * 0.05}s`, "--dur": "0.5s" }} />
                ))}
                {roomDimPaths.map((d) => (
                  <path key={d} d={d} pathLength={1} strokeWidth={1.2} stroke="#9db4f5" className="intro-draw" style={{ "--at": "2s", "--dur": "0.6s" }} />
                ))}
              </g>
            </svg>
            <Image src={furnitureOutline} alt="" fill unoptimized className="intro-in-out object-contain" style={{ "--at": "2.2s", "--out": "2.8s" }} />
            {colorLayers.map(({ src, at }) => (
              <Image key={at} src={src} alt="" fill unoptimized className="intro-in object-contain" style={{ "--at": at }} />
            ))}
          </div>
        </div>

        <p
          className="intro-in-out absolute inset-x-0 bottom-[16%] text-center font-mono text-xs tracking-[0.2em] text-white/85 uppercase"
          style={{ "--at": "1s", "--out": "2.5s" }}
        >
          {t.caption}
        </p>
      </div>

      <button
        type="button"
        onClick={() => skipRef.current()}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-ink/85 px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] text-white uppercase transition-colors hover:bg-ink"
      >
        {t.skip}
      </button>
    </div>
  );
};
