import Image from "next/image";

import boardLayer from "@/assets/illustrations/room-board.svg";
import decorLayer from "@/assets/illustrations/room-decor.svg";
import furnitureLayer from "@/assets/illustrations/room-furniture.svg";
import screensLayer from "@/assets/illustrations/room-screens.svg";
import shellLayer from "@/assets/illustrations/room-shell.svg";

const layers = [shellLayer, furnitureLayer, decorLayer, boardLayer, screensLayer];

/** Callout anchor points in % of the 880×650 drawing: desks, teacher's desk, board. */
const anchors = [
  { x: 40, y: 54 },
  { x: 62, y: 44 },
  { x: 68, y: 26 },
] as const;

interface PlanDrawingProps {
  callouts: readonly [string, string, string];
  axisX: string;
  axisY: string;
  label: string;
}

/**
 * The finished classroom as a sketch: colour layers, dimension lines that draw themselves and
 * callouts. `data-intro-target` is where the intro lands. Server-rendered; animation is CSS.
 */
export const PlanDrawing = ({ callouts, axisX, axisY, label }: PlanDrawingProps): React.JSX.Element => (
  <div className="flex flex-1 items-center p-6 sm:p-8">
    <div data-intro-target role="img" aria-label={label} className="relative mx-auto aspect-[880/650] w-full max-w-[34rem]">
      {layers.map((src, index) => (
        <Image key={src.src} src={src} alt="" fill unoptimized priority={index === 0} className="object-contain" />
      ))}
      <svg aria-hidden viewBox="0 0 880 650" className="absolute inset-0 size-full overflow-visible">
        <g fill="none" stroke="var(--brand)" strokeWidth="1.4">
          <path className="draw" pathLength={1} style={{ "--reveal-delay": "0.5s" }} d="M79 450 L432 611 M82 443 L76 457 M435 604 L429 618" />
          <path className="draw" pathLength={1} style={{ "--reveal-delay": "0.65s" }} d="M461 615 L812 454 M458 608 L464 622 M809 447 L815 461" />
        </g>
        <g className="font-mono" fill="var(--brand)" fontSize="22">
          <text x="226" y="566" transform="rotate(24.5 226 566)" className="reveal" style={{ "--reveal-delay": "0.9s" }}>
            {axisX}
          </text>
          <text x="610" y="560" transform="rotate(-24.5 610 560)" className="reveal" style={{ "--reveal-delay": "1s" }}>
            {axisY}
          </text>
        </g>
      </svg>
      {callouts.map((text, index) => (
        <span
          key={text}
          className="reveal absolute hidden -translate-y-1/2 items-center gap-1.5 sm:flex"
          style={{ left: `${anchors[index].x}%`, top: `${anchors[index].y}%`, "--reveal-delay": `${1 + index * 0.15}s` }}
        >
          <span aria-hidden className="size-2 shrink-0 bg-brand" />
          <span className="border border-brand bg-surface px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-brand">{text}</span>
        </span>
      ))}
    </div>
  </div>
);
