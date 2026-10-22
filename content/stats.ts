/**
 * Numbers for the trust strip under the hero.
 *
 * TODO(axis): `classrooms` and `schools` are PLACEHOLDERS invented for the redesign
 * mockup. Replace them with real figures before publishing: shipping made-up
 * numbers on a live B2B site misleads customers.
 * `directions` (8) and `brands` (11) match the content of the current site.
 */
export const statIds = ["classrooms", "schools", "directions", "brands"] as const;

export type StatId = (typeof statIds)[number];

export interface Stat {
  id: StatId;
  value: number;
  /** Rendered after the number, e.g. "+". */
  suffix?: string;
  placeholder: boolean;
}

export const stats: readonly Stat[] = [
  { id: "classrooms", value: 143, suffix: "+", placeholder: true },
  { id: "schools", value: 52, placeholder: true },
  { id: "directions", value: 8, placeholder: false },
  { id: "brands", value: 11, placeholder: false },
];
