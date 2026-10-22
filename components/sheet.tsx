import type { Dictionary, Lines } from "@/content/types";
import { fill } from "@/lib/template";
import { cn } from "@/lib/utils";

const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

/** "Лист 02" / "02-парақ" / "Sheet 02" for a section number. */
export const sheetTag = (stamp: Dictionary["stamp"], n: number): string =>
  fill(stamp.sheetTag, { n: String(n).padStart(2, "0") });

/** Column letters above the header, like the frame of a drawing sheet. Desktop only. */
export const SheetRuler = (): React.JSX.Element => (
  <div aria-hidden className="container-axis hidden lg:block">
    <div className="grid h-6 grid-cols-12 items-end font-mono text-[10px] text-ink-faint">
      {COLUMNS.map((column) => (
        <span key={column} className="pl-1">
          {column}
        </span>
      ))}
    </div>
  </div>
);

interface SheetHeadingProps {
  id: string;
  title: Lines;
  sheet?: string;
  lead?: string;
  tone?: "light" | "dark";
  className?: string;
}

/** Section heading: big title on the left, sheet tag and a short lead on the right like a title block. */
export const SheetHeading = ({ id, title, sheet, lead, tone = "light", className }: SheetHeadingProps): React.JSX.Element => (
  <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-end", className)}>
    <h2
      id={id}
      className={cn(
        "text-[clamp(2.25rem,4.4vw,4rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance lg:col-span-8",
        tone === "light" ? "text-ink" : "text-white",
      )}
    >
      {title.map((line) => (
        <span key={line} className="block">
          {line}{" "}
        </span>
      ))}
    </h2>
    {(sheet || lead) && (
      <div className="lg:col-span-4 lg:pb-1.5">
        {sheet && <p className={cn("label-mono", tone === "light" ? "text-brand" : "text-brand-light")}>{sheet}</p>}
        {lead && (
          <p className={cn("mt-3 max-w-[44ch] leading-relaxed text-pretty", tone === "light" ? "text-ink-muted" : "text-white/70")}>
            {lead}
          </p>
        )}
      </div>
    )}
  </div>
);

interface StampProps {
  t: Dictionary["stamp"];
  sheet: string;
  className?: string;
}

/** Title block of a drawing: object, stage, project, sheet. */
export const Stamp = ({ t, sheet, className }: StampProps): React.JSX.Element => (
  <dl className={cn("grid grid-cols-[auto_1fr_auto_auto] border-t border-line font-mono text-[11px]", className)}>
    <dt className="border-r border-b border-line px-4 py-2.5 text-ink-faint">{t.object}</dt>
    <dd className="border-r border-b border-line px-4 py-2.5 text-ink">{t.objectValue}</dd>
    <dt className="border-r border-b border-line px-4 py-2.5 text-ink-faint">{t.stage}</dt>
    <dd className="border-b border-line px-4 py-2.5 text-ink">{t.stageValue}</dd>
    <dt className="border-r border-line px-4 py-2.5 text-ink-faint">{t.project}</dt>
    <dd className="border-r border-line px-4 py-2.5 text-ink">{t.projectValue}</dd>
    <dt className="border-r border-line px-4 py-2.5 text-ink-faint">{t.sheet}</dt>
    <dd className="px-4 py-2.5 text-ink">{sheet}</dd>
  </dl>
);
