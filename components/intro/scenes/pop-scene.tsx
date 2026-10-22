import { CartoonScene } from "@/components/intro/scenes/cartoon-scene";
import { ClassroomArt } from "@/components/v2/art/classroom";

/** The box the classroom pops out of: sky body, brand lid with the AXIS corner mark. */
const Box = (): React.JSX.Element => (
  <svg
    viewBox="0 0 200 150"
    fill="none"
    stroke="var(--navy)"
    strokeWidth={3}
    strokeLinejoin="round"
    strokeLinecap="round"
    className="intro-pop-box absolute bottom-[4%] left-1/2 w-[34%] -translate-x-1/2 overflow-visible"
  >
    <rect x={14} y={52} width={172} height={94} rx={14} fill="var(--sky)" />
    <path d="M100 52V146" strokeOpacity={0.4} />
    <g className="intro-pop-lid">
      <rect x={6} y={30} width={188} height={26} rx={10} fill="var(--brand)" />
      <path d="M84 36V50H100" stroke="#ffffff" strokeWidth={4} />
      <rect x={90} y={42} width={5} height={5} rx={1} fill="var(--sun)" stroke="none" />
    </g>
  </svg>
);

/**
 * «Поп-ап класс»: a box pops in, its lid flips open and the classroom springs out of it part by part
 * (room, furniture, desks dropping in, panel, clock, books, a rocking globe, sparkles), then flies into
 * the first screen.
 */
export const PopScene = ({ caption }: { caption: string }): React.JSX.Element => (
  <CartoonScene kind="pop" caption={caption}>
    <ClassroomArt />
    <Box />
  </CartoonScene>
);
