import { describe, expect, it } from "vitest";

import { order70 } from "@/content/order70";
import { countItems, totalItems } from "@/lib/order70";

describe("order70", () => {
  it("matches the item counts on the live site", () => {
    expect({
      informatics: countItems("informatics"),
      art: countItems("art"),
      sewing: countItems("sewing"),
      pottery: countItems("pottery"),
      workshop: countItems("workshop"),
      kazakh: countItems("kazakh"),
      russian: countItems("russian"),
      english: countItems("english"),
    }).toEqual({ informatics: 22, art: 54, sewing: 65, pottery: 45, workshop: 114, kazakh: 39, russian: 30, english: 29 });
    expect(totalItems()).toBe(398);
  });

  it("has a category, a name and a unit for every item", () => {
    for (const groups of Object.values(order70)) {
      for (const group of groups) {
        expect(group.category.trim()).not.toBe("");
        for (const item of group.items) {
          expect(item.name.trim()).not.toBe("");
          expect(item.unit).toMatch(/^[а-яё.²]+$/u);
        }
      }
    }
  });
});
