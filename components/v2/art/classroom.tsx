import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * How much of the classroom is in place: 0 empty room · 1 + furniture · 2 + panel and clock ·
 * 3 + books, globe and sparkles (finished). The process block shows the stages one by one.
 */
export type ClassroomStage = 0 | 1 | 2 | 3;

interface ClassroomArtProps extends Omit<SVGProps<SVGSVGElement>, "stroke"> {
  stage?: ClassroomStage;
  /** Line drawing only (no fills), for the pencil intro: every shape has pathLength 1. */
  outline?: boolean;
}

const NAVY = "var(--navy)";

/** Four-point sparkle centred on (x, y). */
const sparkle = (x: number, y: number, r: number): string =>
  `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`;

interface DeskSpec {
  x: number;
  y: number;
  w: number;
  chair: string;
  item: "book" | "laptop" | "pencils";
}

const desks: readonly DeskSpec[] = [
  { x: 234, y: 322, w: 84, chair: "var(--coral)", item: "laptop" },
  { x: 342, y: 322, w: 84, chair: "var(--brand)", item: "book" },
  { x: 450, y: 322, w: 84, chair: "var(--sun)", item: "laptop" },
  { x: 214, y: 370, w: 98, chair: "var(--sun)", item: "book" },
  { x: 336, y: 370, w: 98, chair: "var(--coral)", item: "laptop" },
  { x: 458, y: 370, w: 98, chair: "var(--brand)", item: "pencils" },
];

/**
 * The v2 cartoon classroom, front view (viewBox 640×440): wall with a window and a clock, the brand
 * interactive panel, a bookcase with a globe, the teacher's desk and six student desks. Navy 2.5px
 * outlines, flat palette fills, no people. Every part is a `<g data-part>` (desks also carry `--i`, their
 * order) so intro scenes can animate them with CSS; the first screen, the process block and the intros
 * all draw this one component.
 */
export const ClassroomArt = ({ stage = 3, outline = false, className, ...rest }: ClassroomArtProps): React.JSX.Element => {
  const fill = (color: string): string => (outline ? "none" : color);
  const mark = (color: string): string => (outline ? NAVY : color);
  const shape = { pathLength: 1 } as const;

  return (
    <svg
      viewBox="0 0 640 440"
      fill="none"
      stroke={NAVY}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("block h-auto w-full overflow-visible", className)}
      {...rest}
    >
      <g data-part="room">
        <path {...shape} d="M16 288V42Q16 16 42 16H598Q624 16 624 42V288Z" fill={fill("#ffffff")} />
        <path {...shape} d="M16 288H624V398Q624 424 598 424H42Q16 424 16 398Z" fill={fill("var(--brand-light)")} />
        <path {...shape} d="M60 330H160M300 410H420M520 346H600" strokeOpacity={outline ? 1 : 0.35} />
        <g data-part="window">
          <rect {...shape} x={40} y={46} width={96} height={128} rx={16} fill={fill("var(--sky)")} />
          <circle {...shape} cx={66} cy={74} r={13} fill={fill("var(--sun)")} />
          <path {...shape} d="M100 150q0-12 12-12q4-10 14-6v24z" fill={fill("#ffffff")} />
          <path {...shape} d="M88 46V174M40 110H136" />
          <rect {...shape} x={32} y={174} width={112} height={12} rx={6} fill={fill("#ffffff")} />
        </g>
      </g>

      {stage >= 2 && (
        <g data-part="clock">
          <circle {...shape} cx={166} cy={74} r={22} fill={fill("#ffffff")} />
          <path {...shape} d="M166 74V60M166 74L176 80" strokeWidth={3} />
          <circle {...shape} cx={166} cy={74} r={2.5} fill={fill(NAVY)} />
        </g>
      )}

      {stage >= 2 && (
        <g data-part="board">
          <rect {...shape} x={196} y={42} width={240} height={150} rx={18} fill={fill("var(--brand)")} />
          <rect {...shape} x={210} y={56} width={212} height={110} rx={10} fill={fill(NAVY)} />
          <path {...shape} d="M230 74V108H256" stroke={mark("#ffffff")} strokeWidth={6} />
          <rect {...shape} x={240} y={94} width={9} height={9} rx={2} fill={fill("var(--sun)")} stroke="none" />
          <path {...shape} d="M230 140q10-10 20 0t20 0t20 0" stroke={mark("#ffffff")} strokeWidth={4} />
          <rect {...shape} x={356} y={120} width={14} height={32} rx={4} fill={fill("var(--sun)")} />
          <rect {...shape} x={376} y={102} width={14} height={50} rx={4} fill={fill("var(--coral)")} />
          <rect {...shape} x={396} y={86} width={14} height={66} rx={4} fill={fill("#ffffff")} />
          <rect {...shape} x={296} y={192} width={40} height={10} rx={5} fill={fill(NAVY)} />
        </g>
      )}

      {stage >= 1 && (
        <g data-part="shelf">
          <rect {...shape} x={470} y={128} width={128} height={174} rx={14} fill={fill("#ffffff")} />
          <path {...shape} d="M470 186H598M470 244H598" />
          <rect {...shape} x={484} y={254} width={50} height={40} rx={8} fill={fill("var(--sky)")} />
          <rect {...shape} x={540} y={254} width={50} height={40} rx={8} fill={fill("var(--sky)")} />
          <circle {...shape} cx={509} cy={274} r={3} fill={fill(NAVY)} />
          <circle {...shape} cx={565} cy={274} r={3} fill={fill(NAVY)} />
        </g>
      )}

      {stage >= 3 && (
        <g data-part="books">
          <rect {...shape} x={484} y={148} width={14} height={36} rx={4} fill={fill("var(--coral)")} />
          <rect {...shape} x={500} y={142} width={14} height={42} rx={4} fill={fill("var(--sun)")} />
          <rect {...shape} x={516} y={152} width={14} height={32} rx={4} fill={fill("var(--brand)")} />
          <rect {...shape} x={540} y={150} width={14} height={34} rx={4} fill={fill("var(--sky)")} transform="rotate(-14 547 167)" />
          <rect {...shape} x={486} y={206} width={46} height={36} rx={8} fill={fill("var(--sun)")} />
          <rect {...shape} x={540} y={214} width={44} height={28} rx={8} fill={fill("var(--coral)")} />
        </g>
      )}

      {stage >= 3 && (
        <g data-part="globe">
          <path {...shape} d="M516 128Q534 116 552 128Z" fill={fill("var(--sun)")} />
          <path {...shape} d="M534 122V112" />
          <circle {...shape} cx={534} cy={88} r={24} fill={fill("var(--sky)")} />
          <path {...shape} d="M518 80q8-8 16-2q4 8-4 12q-8 2-12-10ZM538 96q8-4 12 4q-2 8-10 6q-4-4-2-10Z" fill={fill("var(--brand)")} />
          <path {...shape} d="M506 70Q534 50 560 98" strokeOpacity={outline ? 1 : 0.5} />
        </g>
      )}

      {stage >= 1 && (
        <g data-part="teacher">
          <rect {...shape} x={52} y={318} width={56} height={64} rx={8} fill={fill("#ffffff")} />
          <path {...shape} d="M52 340H108M52 361H108" />
          <rect {...shape} x={166} y={318} width={14} height={64} rx={6} fill={fill("#ffffff")} />
          <rect {...shape} x={40} y={300} width={156} height={20} rx={10} fill={fill("var(--sun)")} />
          <rect {...shape} x={94} y={266} width={52} height={34} rx={6} fill={fill(NAVY)} />
          <path {...shape} d="M104 276L114 284" stroke={mark("#ffffff")} strokeOpacity={outline ? 1 : 0.6} />
          <rect {...shape} x={86} y={296} width={68} height={8} rx={4} fill={fill("#ffffff")} />
        </g>
      )}

      {stage >= 1 &&
        desks.map(({ x, y, w, chair, item }, index) => (
          <g key={`${x}-${y}`} data-part="desk" style={{ "--i": index }}>
            <rect {...shape} x={x + w / 2 - 22} y={y - 26} width={44} height={32} rx={14} fill={fill(chair)} />
            <rect {...shape} x={x + 8} y={y + 14} width={9} height={30} rx={4} fill={fill("#ffffff")} />
            <rect {...shape} x={x + w - 17} y={y + 14} width={9} height={30} rx={4} fill={fill("#ffffff")} />
            <rect {...shape} x={x} y={y} width={w} height={16} rx={8} fill={fill("#ffffff")} />
            {item === "laptop" && (
              <>
                <rect {...shape} x={x + w / 2 - 14} y={y - 18} width={28} height={18} rx={4} fill={fill(NAVY)} />
                <rect {...shape} x={x + w / 2 - 19} y={y - 3} width={38} height={6} rx={3} fill={fill("var(--sky)")} />
              </>
            )}
            {item === "book" && (
              <rect {...shape} x={x + w / 2 - 16} y={y - 9} width={32} height={10} rx={3} fill={fill("var(--coral)")} />
            )}
            {item === "pencils" && (
              <>
                <rect {...shape} x={x + w / 2 - 9} y={y - 16} width={18} height={17} rx={5} fill={fill("var(--sky)")} />
                <path {...shape} d={`M${x + w / 2 - 4} ${y - 16}L${x + w / 2 - 8} ${y - 28}M${x + w / 2 + 3} ${y - 16}L${x + w / 2 + 6} ${y - 30}`} stroke={mark("var(--coral)")} strokeWidth={3.5} />
              </>
            )}
          </g>
        ))}

      {stage >= 3 && (
        <g data-part="stars">
          <path {...shape} d={sparkle(178, 136, 10)} fill={fill("var(--sun)")} />
          <path {...shape} d={sparkle(452, 228, 9)} fill={fill("var(--coral)")} />
          <path {...shape} d={sparkle(608, 112, 7)} fill={fill("var(--sun)")} />
        </g>
      )}
    </svg>
  );
};
