import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  sun: "bg-sun",
  coral: "bg-coral",
  sky: "bg-sky",
  white: "bg-white",
} as const;

/** A small rounded label with the v2 sticker outline. Text stays navy on every tone (AA on all four). */
export const Sticker = ({
  tone = "sun",
  className,
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: ReactNode;
}): React.JSX.Element => (
  <span
    className={cn(
      "inline-flex items-center gap-2 rounded-full border-[2.5px] border-navy px-3.5 py-1 text-sm leading-tight font-extrabold text-navy shadow-sticker-sm",
      tones[tone],
      className,
    )}
  >
    {children}
  </span>
);
