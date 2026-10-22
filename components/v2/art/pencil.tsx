/**
 * The pencil character of the pencil intro (viewBox 48×160, tip at the bottom centre): coral eraser,
 * sun body with a face, wooden cone and a navy point. Eyes carry `intro-pencil-eye` for blinking.
 */
export const PencilArt = ({ className }: { className?: string }): React.JSX.Element => (
  <svg
    viewBox="0 0 48 160"
    fill="none"
    stroke="var(--navy)"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={className}
  >
    <rect x={8} y={4} width={32} height={22} rx={9} fill="var(--coral)" />
    <rect x={8} y={24} width={32} height={12} rx={2} fill="var(--sky)" />
    <path d="M8 30H40" strokeWidth={1.5} />
    <rect x={8} y={34} width={32} height={86} rx={3} fill="var(--sun)" />
    <path d="M24 38V116" strokeOpacity={0.25} />
    <circle className="intro-pencil-eye" cx={18} cy={62} r={3} fill="var(--navy)" stroke="none" />
    <circle className="intro-pencil-eye" cx={30} cy={62} r={3} fill="var(--navy)" stroke="none" />
    <circle cx={14} cy={72} r={2.5} fill="var(--coral)" stroke="none" opacity={0.7} />
    <circle cx={34} cy={72} r={2.5} fill="var(--coral)" stroke="none" opacity={0.7} />
    <path d="M19 73Q24 79 29 73" />
    <path d="M8 120L24 152L40 120Z" fill="#ffffff" />
    <path d="M19 141L24 153L29 141Z" fill="var(--navy)" />
  </svg>
);
