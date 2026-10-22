import type { ReactNode } from "react";

import type { CabinetId } from "@/content/cabinets";
import { cn } from "@/lib/utils";

const NAVY = "var(--navy)";
const BLOB = "M60 8C89 8 112 27 112 58C112 90 91 112 59 112C28 112 8 93 8 62C8 31 31 8 60 8Z";

/** Background tone of each cabinet's blob; neighbours in `cabinetIds` order never share a tone. */
const tones: Record<CabinetId, string> = {
  informatics: "var(--sky)",
  art: "var(--sun)",
  sewing: "var(--coral)",
  pottery: "var(--sky)",
  workshop: "var(--sun)",
  kazakh: "var(--coral)",
  russian: "var(--sky)",
  english: "var(--sun)",
};

/** Letters drawn as text inside the icons: decorative (the icon is aria-hidden), Nunito from the page. */
const Letters = ({ x, y, size, children }: { x: number; y: number; size: number; children: ReactNode }): React.JSX.Element => (
  <text x={x} y={y} fontSize={size} fontWeight={900} textAnchor="middle" fill={NAVY} stroke="none">
    {children}
  </text>
);

const objects: Record<CabinetId, ReactNode> = {
  informatics: (
    <>
      <rect x={28} y={28} width={64} height={46} rx={9} fill={NAVY} />
      <rect x={35} y={35} width={50} height={32} rx={5} fill="var(--brand)" />
      <path d="M43 59l8-8l7 6l12-12" stroke="#ffffff" strokeWidth={3.5} />
      <rect x={54} y={74} width={12} height={10} fill="#ffffff" />
      <rect x={42} y={83} width={36} height={7} rx={3.5} fill="#ffffff" />
      <rect x={30} y={94} width={60} height={11} rx={5.5} fill="#ffffff" />
      <path d="M40 99.5H80" strokeWidth={2} strokeDasharray="3 5" />
    </>
  ),
  art: (
    <>
      <path d="M60 22L38 104M60 22L82 104M60 22V98" strokeWidth={4} />
      <rect x={32} y={30} width={56} height={44} rx={7} fill="#ffffff" />
      <circle cx={46} cy={44} r={6} fill="var(--coral)" />
      <path d="M34 68l14-12l10 8l12-14l16 18Z" fill="var(--brand)" />
      <path d="M70 92q-4-14 12-16q14 0 16 10q2 10-10 10q-4 0-4 4q0 4-6 2q-6-2-8-10Z" fill="#ffffff" />
      <circle cx={80} cy={84} r={2.5} fill="var(--coral)" />
      <circle cx={89} cy={83} r={2.5} fill="var(--brand)" />
      <circle cx={92} cy={91} r={2.5} fill={NAVY} />
    </>
  ),
  sewing: (
    <>
      <rect x={22} y={84} width={78} height={14} rx={7} fill="var(--brand)" />
      <rect x={74} y={40} width={20} height={48} rx={9} fill="#ffffff" />
      <rect x={24} y={38} width={70} height={18} rx={9} fill="#ffffff" />
      <path d="M38 56V74M34 74H42" strokeWidth={3} />
      <circle cx={84} cy={64} r={7} fill="var(--sun)" />
      <rect x={50} y={24} width={12} height={14} rx={3} fill="var(--sun)" />
      <path d="M56 24q10-10 22-4" strokeWidth={2} />
    </>
  ),
  pottery: (
    <>
      <ellipse cx={60} cy={96} rx={36} ry={9} fill="#ffffff" />
      <ellipse cx={60} cy={89} rx={28} ry={7} fill="var(--sun)" />
      <path d="M47 86Q38 72 46 60Q51 52 49 40H71Q69 52 74 60Q82 72 73 86Z" fill="var(--coral)" />
      <rect x={46} y={34} width={28} height={8} rx={4} fill="var(--coral)" />
      <path d="M50 66Q60 70 70 66" strokeWidth={2} />
    </>
  ),
  workshop: (
    <>
      <rect x={28} y={76} width={10} height={26} rx={4} fill="#ffffff" />
      <rect x={82} y={76} width={10} height={26} rx={4} fill="#ffffff" />
      <rect x={18} y={66} width={84} height={12} rx={6} fill="var(--coral)" />
      <rect x={30} y={54} width={36} height={12} rx={4} fill="#ffffff" />
      <path d="M38 60H58" strokeWidth={2} strokeDasharray="2 4" />
      <g transform="rotate(32 82 40)">
        <rect x={78} y={30} width={8} height={36} rx={4} fill="var(--brand)" />
        <rect x={68} y={22} width={28} height={12} rx={4} fill={NAVY} />
      </g>
    </>
  ),
  kazakh: (
    <>
      <g transform="rotate(-28 46 66)">
        <rect x={42} y={18} width={8} height={56} rx={4} fill="#ffffff" />
        <rect x={39} y={14} width={14} height={10} rx={3} fill={NAVY} />
        <path d="M46 70C30 70 26 88 32 98C37 106 55 106 60 98C66 88 62 70 46 70Z" fill="var(--sun)" />
        <circle cx={46} cy={88} r={4} fill={NAVY} />
        <path d="M44 24V86M48 24V86" strokeWidth={1.2} />
      </g>
      <rect x={68} y={48} width={36} height={44} rx={7} fill="#ffffff" />
      <path d="M72 48V92" strokeWidth={2} />
      <Letters x={89} y={77} size={17}>
        Әә
      </Letters>
    </>
  ),
  russian: (
    <>
      <path d="M60 42Q44 32 22 38V90Q44 84 60 94Z" fill="#ffffff" />
      <path d="M60 42Q76 32 98 38V90Q76 84 60 94Z" fill="#ffffff" />
      <path d="M60 42V94" />
      <path d="M30 52Q42 49 52 54M30 62Q42 59 52 64M30 72Q42 69 52 74" strokeWidth={2} />
      <Letters x={79} y={73} size={19}>
        Аа
      </Letters>
      <path d="M86 34V52l5-4l5 4V30" fill="var(--coral)" />
    </>
  ),
  english: (
    <>
      <path d="M38 30H84Q104 30 104 50Q104 70 84 70H56L40 86L44 70H38Q18 70 18 50Q18 30 38 30Z" fill="#ffffff" />
      <Letters x={61} y={57} size={19}>
        Hello
      </Letters>
      <path d="M92 86Q92 96 102 96Q92 96 92 106Q92 96 82 96Q92 96 92 86Z" fill="var(--coral)" />
    </>
  ),
};

/**
 * Spot illustration of one cabinet (viewBox 120×120): a soft blob in the cabinet's tone with one object
 * on it. Same outline language as the classroom; decorative, so aria-hidden.
 */
export const CabinetIcon = ({ id, className }: { id: CabinetId; className?: string }): React.JSX.Element => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    stroke={NAVY}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={cn("block size-full overflow-visible", className)}
  >
    <path d={BLOB} fill={tones[id]} />
    {objects[id]}
  </svg>
);
