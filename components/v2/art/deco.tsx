import { cn } from "@/lib/utils";

/** Decorative bits of the v2 language. All aria-hidden; colours via `className` (fill-sun, fill-coral…). */
export const Sparkle = ({ className }: { className?: string }): React.JSX.Element => (
  <svg viewBox="0 0 40 40" aria-hidden className={cn("size-8 fill-sun stroke-navy", className)} strokeWidth={2.5} strokeLinejoin="round">
    <path d="M20 3Q20 20 37 20Q20 20 20 37Q20 20 3 20Q20 20 20 3Z" />
  </svg>
);

export const Squiggle = ({ className }: { className?: string }): React.JSX.Element => (
  <svg viewBox="0 0 120 24" aria-hidden className={cn("h-6 w-28 stroke-coral", className)} fill="none" strokeWidth={4} strokeLinecap="round">
    <path d="M4 12q9-12 18 0t18 0t18 0t18 0t18 0t18 0" />
  </svg>
);

export const Dots = ({ className }: { className?: string }): React.JSX.Element => (
  <svg viewBox="0 0 60 36" aria-hidden className={cn("h-9 w-15 fill-navy", className)}>
    {[0, 1, 2].flatMap((row) => [0, 1, 2, 3].map((col) => <circle key={`${row}-${col}`} cx={6 + col * 16} cy={6 + row * 12} r={3} />))}
  </svg>
);
