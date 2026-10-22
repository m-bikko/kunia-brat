/**
 * Intro kinds, the rotation pool of each site version and the pure choice logic. `versionOfPath` and
 * `pickIntro` are serialized into the boot script (components/intro/intro-boot.tsx), so they must not
 * reference anything outside themselves.
 */
export const introKinds = ["blueprint", "pop", "blocks", "pencil", "bell"] as const;
export type IntroKind = (typeof introKinds)[number];

export type SiteVersion = "v1" | "v2";

export const isIntroKind = (value: string | null): value is IntroKind =>
  value !== null && (introKinds as readonly string[]).includes(value);

/** Which intros each version rotates. Kinds join the pools as their scenes are built. */
export const introPools: Record<SiteVersion, readonly IntroKind[]> = {
  v1: ["blueprint", "pop"],
  v2: ["pop"],
};

/** How an intro hands over to the page: fly into the first screen, or reveal it (its own CSS exit). */
export const introHandoff: Record<IntroKind, "flight" | "reveal"> = {
  blueprint: "flight",
  pop: "flight",
  blocks: "flight",
  pencil: "flight",
  bell: "reveal",
};

/** sessionStorage key ("seen" this session) and localStorage key (last kind shown), per version. */
export const introStorageKeys: Record<SiteVersion, { session: string; last: string }> = {
  v1: { session: "axis-intro", last: "axis-intro-last" },
  v2: { session: "axis-intro-v2", last: "axis-intro-last-v2" },
};

/** v2 pages end with "/v2": /v2, /kk/v2, /en/v2. */
export const versionOfPath = (pathname: string): SiteVersion => (/\/v2\/?$/.test(pathname) ? "v2" : "v1");

/** A random kind from the pool, never the one shown last (unless it is the only one). */
export const pickIntro = (pool: readonly IntroKind[], last: string | null, random: number): IntroKind => {
  const options = pool.length > 1 ? pool.filter((kind) => kind !== last) : pool;
  const choice = options[Math.min(options.length - 1, Math.floor(random * options.length))];
  if (choice === undefined) throw new Error("empty intro pool");
  return choice;
};

/** The intro's last frame is the first screen's own illustration, so the flight lands one-to-one. */
export const landsExactly = (version: SiteVersion, kind: IntroKind): boolean =>
  version === "v1" ? kind === "blueprint" : kind !== "blueprint" && kind !== "bell";
