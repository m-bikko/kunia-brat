import Image from "next/image";

import boardLayer from "@/assets/illustrations/room-board.svg";
import decorLayer from "@/assets/illustrations/room-decor.svg";
import furnitureOutline from "@/assets/illustrations/room-furniture-outline.svg";
import furnitureLayer from "@/assets/illustrations/room-furniture.svg";
import screensLayer from "@/assets/illustrations/room-screens.svg";
import shellLayer from "@/assets/illustrations/room-shell.svg";
import { roomDetailPaths, roomDimPaths, roomGridPaths, roomStructurePaths } from "@/components/intro/room-outline";

const colorLayers = [
  { src: shellLayer, at: "2.7s" },
  { src: furnitureLayer, at: "2.9s" },
  { src: decorLayer, at: "3s" },
  { src: boardLayer, at: "3.1s" },
  { src: screensLayer, at: "3.2s" },
] as const;

/**
 * «Синька»: logo corner → X/Y axes → classroom in white lines → develops into colour → the room
 * (`data-intro-subject`) flies into the v1 first screen's sketch. Pure CSS timeline (app/styles/intro.css);
 * the hand-off is run by IntroStage.
 */
export const BlueprintScene = ({ caption }: { caption: string }): React.JSX.Element => (
  <div className="intro-scene" data-kind="blueprint">
    <div data-intro-bg className="intro-bg" />
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
        <div data-intro-subject className="relative aspect-[880/650] w-[min(80vw,54rem)]">
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
        {caption}
      </p>
    </div>
  </div>
);
