import type { CabinetId } from "@/content/cabinets";
import { order70 } from "@/content/order70";

/** Number of Order No. 70 items for one cabinet. */
export const countItems = (id: CabinetId): number =>
  order70[id].reduce((sum, group) => sum + group.items.length, 0);

/** Number of Order No. 70 items across all cabinets. */
export const totalItems = (): number =>
  Object.values(order70).reduce(
    (sum, groups) => sum + groups.reduce((inner, group) => inner + group.items.length, 0),
    0,
  );
