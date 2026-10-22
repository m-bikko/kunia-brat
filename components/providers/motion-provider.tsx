"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Makes every motion animation on the site respect the OS "reduce motion" setting. */
export const MotionProvider = ({ children }: { children: ReactNode }): React.JSX.Element => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);
