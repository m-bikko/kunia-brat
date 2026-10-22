import type { StaticImageData } from "next/image";

import artImage from "@/assets/images/cabinets/art.webp";
import englishImage from "@/assets/images/cabinets/english.webp";
import informaticsImage from "@/assets/images/cabinets/informatics.webp";
import kazakhImage from "@/assets/images/cabinets/kazakh.webp";
import potteryImage from "@/assets/images/cabinets/pottery.webp";
import russianImage from "@/assets/images/cabinets/russian.webp";
import sewingImage from "@/assets/images/cabinets/sewing.webp";
import workshopImage from "@/assets/images/cabinets/workshop.webp";

/**
 * The eight classroom directions AXIS fits out.
 * Copy for each one lives in the locale dictionaries under `cabinets.items`.
 */
export const cabinetIds = [
  "informatics",
  "art",
  "sewing",
  "pottery",
  "workshop",
  "kazakh",
  "russian",
  "english",
] as const;

export type CabinetId = (typeof cabinetIds)[number];

export const isCabinetId = (value: string): value is CabinetId =>
  (cabinetIds as readonly string[]).includes(value);

export type CabinetCategory = "technology" | "creativity" | "craft" | "languages";

export interface Cabinet {
  id: CabinetId;
  category: CabinetCategory;
  /** Three-letter index code shown in the drawing index, e.g. "INF". */
  code: string;
  /** Concept render (not a photo of a finished project). */
  image: StaticImageData;
  /** Existing detail page on axisgroup.kz. */
  href: string;
  /** Existing 3D walkthrough, when one exists. */
  tourHref?: string;
}

export const cabinets: Record<CabinetId, Cabinet> = {
  informatics: {
    id: "informatics",
    category: "technology",
    code: "INF",
    image: informaticsImage,
    href: "/kabinet-informatiki",
    tourHref: "/virtual-classroom",
  },
  art: {
    id: "art",
    category: "creativity",
    code: "ART",
    image: artImage,
    href: "/art-kabinet",
    tourHref: "/art-classroom",
  },
  sewing: {
    id: "sewing",
    category: "craft",
    code: "SEW",
    image: sewingImage,
    href: "/shveynaya-masterskaya",
    tourHref: "/sewing-classroom",
  },
  pottery: {
    id: "pottery",
    category: "creativity",
    code: "POT",
    image: potteryImage,
    href: "/goncharnaya-studiya",
  },
  workshop: {
    id: "workshop",
    category: "craft",
    code: "WRK",
    image: workshopImage,
    href: "/masterskaya-truda",
  },
  kazakh: {
    id: "kazakh",
    category: "languages",
    code: "KAZ",
    image: kazakhImage,
    href: "/kabinet-kazakhskogo-yazyka",
  },
  russian: {
    id: "russian",
    category: "languages",
    code: "RUS",
    image: russianImage,
    href: "/kabinet-russkogo-yazyka",
  },
  english: {
    id: "english",
    category: "languages",
    code: "ENG",
    image: englishImage,
    href: "/kabinet-angliyskogo-yazyka",
  },
};

