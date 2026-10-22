import "react";

declare module "react" {
  interface CSSProperties {
    /** CSS custom properties such as `--reveal-delay` used by the drawing animations. */
    [key: `--${string}`]: string | number | undefined;
  }
}
