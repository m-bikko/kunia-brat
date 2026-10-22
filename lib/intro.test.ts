import { describe, expect, it } from "vitest";

import { introPools, isIntroKind, landsExactly, pickIntro, versionOfPath } from "@/lib/intro";

describe("intro rotation", () => {
  it("never repeats the last kind when the pool has a choice", () => {
    for (let r = 0; r < 1; r += 0.05) expect(pickIntro(["pop", "bell"], "pop", r)).toBe("bell");
  });

  it("covers the whole pool", () => {
    const seen = new Set([0, 0.3, 0.6, 0.99].map((r) => pickIntro(["pop", "blocks", "pencil", "bell"], null, r)));
    expect(seen.size).toBe(4);
  });

  it("repeats when the pool has one kind", () => {
    expect(pickIntro(["blueprint"], "blueprint", 0.5)).toBe("blueprint");
  });

  it("tells v2 paths from v1", () => {
    expect(["/v2", "/kk/v2", "/en/v2/"].map(versionOfPath)).toEqual(["v2", "v2", "v2"]);
    expect(["/", "/kk", "/en", "/v2x"].map(versionOfPath)).toEqual(["v1", "v1", "v1", "v1"]);
  });

  it("works when serialized into the boot script", () => {
    const pick: unknown = new Function(`return (${pickIntro.toString()})`)();
    if (typeof pick !== "function") throw new Error("not a function");
    expect(pick(["pop", "bell"], "bell", 0.1)).toBe("pop");
    const version: unknown = new Function(`return (${versionOfPath.toString()})`)();
    if (typeof version !== "function") throw new Error("not a function");
    expect(version("/kk/v2")).toBe("v2");
  });

  it("knows kinds and exact hand-offs", () => {
    expect(isIntroKind("pencil")).toBe(true);
    expect(isIntroKind("x")).toBe(false);
    expect(isIntroKind(null)).toBe(false);
    expect(landsExactly("v1", "blueprint")).toBe(true);
    expect(landsExactly("v1", "pop")).toBe(false);
    expect(landsExactly("v2", "pop")).toBe(true);
    expect(landsExactly("v2", "bell")).toBe(false);
    expect(introPools.v2).not.toContain("blueprint");
  });
});
