import type { SplitTitle } from "@/content/types";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  id: string;
  title: SplitTitle;
  lead?: string;
  /** Small label above the headline. Use sparingly: at most one per three sections. */
  eyebrow?: string;
  tone?: "light" | "dark";
  className?: string;
}

/** Stacked section heading: headline with an accented second half, optional lead below. */
export const SectionTitle = ({
  id,
  title,
  lead,
  eyebrow,
  tone = "light",
  className,
}: SectionTitleProps): React.JSX.Element => (
  <div className={cn("max-w-3xl", className)}>
    {eyebrow && (
      <p
        className={cn(
          "mb-5 text-[0.78rem] font-bold tracking-[0.14em] uppercase",
          tone === "light" ? "text-brand" : "text-brand-light",
        )}
      >
        {eyebrow}
      </p>
    )}
    <h2
      id={id}
      className={cn(
        "text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance",
        tone === "light" ? "text-ink" : "text-white",
      )}
    >
      {title.lead}{" "}
      <span className={tone === "light" ? "text-brand" : "text-brand-light"}>{title.accent}</span>
    </h2>
    {lead && (
      <p
        className={cn(
          "mt-5 max-w-[60ch] text-lg leading-relaxed text-pretty",
          tone === "light" ? "text-ink-muted" : "text-white/70",
        )}
      >
        {lead}
      </p>
    )}
  </div>
);
