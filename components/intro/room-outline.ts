/**
 * White line-art of the isometric classroom for the blueprint intro, in the 880×650 space of
 * assets/illustrations/room-*.svg. Coordinates come from the source illustration of the live site.
 */

/** Floor, floor edge and the two walls: drawn first. */
export const roomStructurePaths = [
  "M440 235 L790 395 L440 555 L90 395 Z",
  "M90 395 L90 407.4 L440 567.4 L790 407.4 L790 395",
  "M91 395.5 L91 175.4 L441 15.4 L441 235.5",
  "M439.7 15.1 L789.7 175.1 L789.7 395.2",
] as const;

/** Floor tiles: faint. */
export const roomGridPaths = [
  "M370 266.4 L720 426.4",
  "M510 266.4 L160 426.4",
  "M300 298.4 L650 458.4",
  "M580 298.4 L230 458.4",
  "M230 330.4 L580 490.4",
  "M650 330.4 L300 490.4",
  "M160 362.4 L510 522.4",
  "M720 362.4 L370 522.4",
] as const;

/** Three windows and the board. */
export const roomDetailPaths = [
  "M403.3 194.5 L329.8 228.1 L329.8 102.2 L403.3 68.6 Z",
  "M367.5 208.7 L367.5 87.8",
  "M303.5 240.1 L230 273.7 L230 147.8 L303.5 114.2 Z",
  "M267.8 254.3 L267.8 133.4",
  "M203.8 285.7 L130.3 319.3 L130.3 193.4 L203.8 159.8 Z",
  "M168.1 299.9 L168.1 179",
  "M553.8 205.5 L669.3 258.3 L669.3 157.9 L553.8 105.1 Z",
] as const;

/** Dimension lines with end ticks. */
export const roomDimPaths = [
  "M79 450 L432 611 M82 443 L76 457 M435 604 L429 618",
  "M461 615 L812 454 M458 608 L464 622 M809 447 L815 461",
] as const;
