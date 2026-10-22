"use client";

import { useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";

import { cabinetIds, type CabinetId } from "@/content/cabinets";
import { order70, type Order70Group } from "@/content/order70";
import type { Dictionary } from "@/content/types";
import { countItems } from "@/lib/order70";
import { buildQuoteMessage, type QuoteTemplates } from "@/lib/quote-message";
import { whatsappUrl } from "@/lib/site";

/** Key of an item inside one cabinet; names can repeat across categories. */
export const itemKey = (group: number, item: number): string => `${group}:${item}`;

export interface Order70Kit {
  active: CabinetId;
  select: (id: CabinetId) => void;
  /** Tab buttons in `cabinetIds` order, for roving focus. */
  tabRefs: RefObject<Array<HTMLButtonElement | null>>;
  /** Arrow keys, Home and End move between the tabs (ARIA tabs pattern). */
  onTabKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  baseId: string;
  panelId: string;
  groups: readonly Order70Group[];
  isChecked: (key: string) => boolean;
  toggle: (key: string) => void;
  /** Clears the ticks of the active classroom only. */
  reset: () => void;
  total: number;
  have: number;
  need: number;
  /** WhatsApp link with the request for the active classroom. */
  href: string;
}

/**
 * State of the Order No. 70 kit tool: the active classroom, ticks kept per classroom while switching,
 * counts and the WhatsApp request. Shared by the v1 and v2 tools; each draws its own markup.
 */
export const useOrder70Kit = ({
  items,
  templates,
}: {
  items: Dictionary["cabinets"]["items"];
  templates: QuoteTemplates;
}): Order70Kit => {
  const [active, setActive] = useState<CabinetId>("informatics");
  const [ticks, setTicks] = useState<Partial<Record<CabinetId, readonly string[]>>>({});
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const groups = order70[active];
  const checked = ticks[active] ?? [];
  const total = countItems(active);
  const have = checked.length;
  const haveNames = groups.flatMap((group, g) =>
    group.items.flatMap((item, i) => (checked.includes(itemKey(g, i)) ? [item.name] : [])),
  );
  const message = buildQuoteMessage({ cabinet: items[active].name, total, haveItems: haveNames, templates });

  const toggle = (key: string): void =>
    setTicks((previous) => {
      const current = previous[active] ?? [];
      return { ...previous, [active]: current.includes(key) ? current.filter((k) => k !== key) : [...current, key] };
    });

  const reset = (): void => setTicks((previous) => ({ ...previous, [active]: [] }));

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const last = cabinetIds.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(cabinetIds[next]);
    tabRefs.current[next]?.focus();
  };

  return {
    active,
    select: setActive,
    tabRefs,
    onTabKeyDown,
    baseId,
    panelId: `${baseId}-panel`,
    groups,
    isChecked: (key) => checked.includes(key),
    toggle,
    reset,
    total,
    have,
    need: total - have,
    href: whatsappUrl(message),
  };
};
