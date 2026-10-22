import { fill } from "@/lib/template";

/** Localized lines of the WhatsApp request (dictionary key `order70.message`). */
export interface QuoteTemplates {
  /** `{cabinet}` */
  intro: string;
  /** `{total}` */
  total: string;
  /** `{have}`, `{list}` */
  have: string;
  haveNone: string;
  /** `{need}` */
  need: string;
  /** `{count}` — appended when the list of owned items is cut */
  more: string;
}

interface QuoteInput {
  cabinet: string;
  total: number;
  haveItems: readonly string[];
  templates: QuoteTemplates;
  maxLength?: number;
}

/**
 * Short request for a quote: cabinet, size of the Order No. 70 list and what the school already has.
 * Listing what is owned is usually shorter than listing what is missing; long lists are cut with "and N more".
 */
export const buildQuoteMessage = ({ cabinet, total, haveItems, templates, maxLength = 1800 }: QuoteInput): string => {
  const head = fill(templates.intro, { cabinet });
  const totalLine = fill(templates.total, { total });
  const needLine = fill(templates.need, { need: total - haveItems.length });

  if (haveItems.length === 0) return [head, totalLine, templates.haveNone, needLine].join("\n");

  const compose = (list: string): string =>
    [head, totalLine, fill(templates.have, { have: haveItems.length, list }), needLine].join("\n");

  let shown = haveItems.length;
  let message = compose(haveItems.join("; "));
  while (message.length > maxLength && shown > 1) {
    shown -= 1;
    const rest = fill(templates.more, { count: haveItems.length - shown });
    message = compose(`${haveItems.slice(0, shown).join("; ")} ${rest}`);
  }
  return message;
};
