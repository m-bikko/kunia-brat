/**
 * Blueprint intro moments in ms. The CSS animations in app/globals.css (section "Blueprint intro")
 * use the same moments in seconds; change both together.
 */
export const INTRO = {
  flightAt: 3400,
  flightMs: 900,
  /** The CSS failsafe exit of `.intro` starts here when the app's JS has not taken over. */
  failsafeAt: 4000,
  /** …and ends here; the boot script then lifts `data-intro` so the first screen plays. */
  failsafeMs: 4400,
} as const;
