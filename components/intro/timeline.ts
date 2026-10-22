/**
 * Intro moments in ms, shared by every kind. The CSS in app/styles/intro.css uses the same moments in
 * seconds; change both together.
 */
export const INTRO = {
  /** Main action of every kind runs from 0 to here; then the hand-off starts. */
  flightAt: 3400,
  flightMs: 900,
  /** Kinds that reveal the page with their own CSS exit (bell) are done here. */
  revealEndMs: 3650,
  /** The CSS failsafe exit of `.intro` starts here when the app's JS has not taken over. */
  failsafeAt: 4000,
  /** …and ends here; the boot script then lifts `data-intro` so the first screen plays. */
  failsafeMs: 4400,
} as const;
