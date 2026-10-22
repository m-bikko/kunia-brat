/** The school bell of the bell intro (viewBox 120×130): sun dome, coral knob and clapper. */
export const BellArt = ({ className }: { className?: string }): React.JSX.Element => (
  <svg
    viewBox="0 0 120 130"
    fill="none"
    stroke="var(--navy)"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={className}
  >
    <circle cx={60} cy={14} r={7} fill="var(--coral)" />
    <circle cx={60} cy={104} r={9} fill="var(--coral)" />
    <path d="M60 20C36 20 27 40 27 62V80L16 94H104L93 80V62C93 40 84 20 60 20Z" fill="var(--sun)" />
    <path d="M40 48Q44 34 56 30" stroke="#ffffff" strokeWidth={4} />
    <path d="M24 94H96" />
  </svg>
);
