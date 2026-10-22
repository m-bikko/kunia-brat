import Image from "next/image";

import { BellArt } from "@/components/v2/art/bell";

const waves = [
  { className: "border-sun", at: "0.6s" },
  { className: "border-white", at: "1.1s" },
  { className: "border-sky", at: "1.6s" },
] as const;

/**
 * «Школьный звонок»: the bell swings, round waves ring out, the logo and caption appear, then the navy
 * backdrop shrinks into a circle at the bell and reveals the page (no flight: `introHandoff.bell` is
 * "reveal", the CSS exit ends at INTRO.revealEndMs).
 */
export const BellScene = ({ caption }: { caption: string }): React.JSX.Element => (
  <div className="intro-scene intro-cartoon" data-kind="bell">
    <div aria-hidden className="intro-bell-reveal absolute inset-0">
      <div className="intro-bell-disc absolute rounded-full bg-navy" />
      {waves.map(({ className, at }) => (
        <span key={at} className={`intro-bell-wave absolute rounded-full border-[3px] ${className}`} style={{ "--at": at }} />
      ))}
      <div className="absolute top-[40%] left-1/2 w-[clamp(6rem,14vw,9rem)] -translate-x-1/2 -translate-y-1/2">
        <BellArt className="intro-bell block h-auto w-full overflow-visible" />
      </div>
      <Image
        src="/brand/axis-logo.png"
        alt=""
        width={2108}
        height={640}
        className="intro-in absolute top-[calc(40%+clamp(4.5rem,10vw,6.5rem))] left-1/2 h-8 w-auto -translate-x-1/2 brightness-0 invert"
        style={{ "--at": "2.2s" }}
      />
    </div>
    <p className="intro-caption-soft">{caption}</p>
  </div>
);
