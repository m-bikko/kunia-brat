import type { CabinetCategory, CabinetId } from "@/content/cabinets";
import type { StatId } from "@/content/stats";
import type { PluralForms } from "@/lib/i18n";

/** Two-part headline: the second part is rendered in the brand accent. */
export interface SplitTitle {
  lead: string;
  accent: string;
}

/** A display title split into lines exactly where the design breaks them. */
export type Lines = readonly string[];

export interface TextLink {
  label: string;
  href: string;
}

export interface CabinetCopy {
  name: string;
  text: string;
  features: readonly [string, string, string];
  /** Anchor text for the SEO directory: "Оснащение кабинета ...". */
  directoryLabel: string;
}

export interface ProcessStepCopy {
  label: string;
  title: string;
  text: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  link?: TextLink;
}

/**
 * Every visible string of the landing. `ru`, `kk` and `en` must implement all of it,
 * so a missing translation fails the type check instead of shipping blank UI.
 */
export interface Dictionary {
  meta: {
    title: string;
    description: string;
    ogImageAlt: string;
  };
  stamp: {
    object: string;
    objectValue: string;
    stage: string;
    stageValue: string;
    project: string;
    projectValue: string;
    sheet: string;
    /** `{n}` is the two-digit sheet number. */
    sheetTag: string;
  };
  nav: {
    skipToContent: string;
    cabinets: string;
    order70: string;
    process: string;
    catalog: string;
    services: string;
    about: string;
    contactCta: string;
    menuOpen: string;
    menuClose: string;
    languageLabel: string;
  };
  hero: {
    kicker: string;
    title: Lines;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    sheetLabel: string;
    sheetScale: string;
    callouts: readonly [string, string, string];
    axisX: string;
    axisY: string;
  };
  stats: {
    label: string;
    items: Record<StatId, PluralForms>;
  };
  cabinets: {
    title: SplitTitle;
    lead: string;
    openKit: string;
    tour: string;
    quote: string;
    categories: Record<CabinetCategory, string>;
    items: Record<CabinetId, CabinetCopy>;
    languagesTitle: string;
    languagesText: string;
    languagesLinks: Record<"kazakh" | "russian" | "english", string>;
  };
  showroom: {
    eyebrow: string;
    title: SplitTitle;
    text: string;
    tabsLabel: string;
    enter: string;
    hint: string;
  };
  brands: {
    title: SplitTitle;
    text: string;
  };
  process: {
    title: SplitTitle;
    steps: readonly [ProcessStepCopy, ProcessStepCopy, ProcessStepCopy, ProcessStepCopy];
    more: string;
    illustrationAlt: string;
  };
  team: {
    title: SplitTitle;
    workshop: { kicker: string; title: string; text: string; alt: string };
    store: { kicker: string; title: string; text: string; alt: string };
    teamTitle: string;
    teamText: string;
  };
  faq: {
    title: string;
    items: readonly FaqItem[];
    directoryTitle: string;
    directoryText: string;
  };
  g8: {
    title: SplitTitle;
    text: string;
    cta: string;
  };
  contact: {
    eyebrow: string;
    title: SplitTitle;
    text: string;
    selectLabel: string;
    submit: string;
    alternatives: string;
    /** `{cabinet}` is replaced with the selected cabinet name. */
    messageTemplate: string;
  };
  footer: {
    about: string;
    solutions: string;
    navigation: string;
    contact: string;
    guide: string;
    order70: string;
    address: string;
    rights: string;
  };
  whatsappFab: string;
  notFound: {
    title: string;
    text: string;
    home: string;
  };
}
