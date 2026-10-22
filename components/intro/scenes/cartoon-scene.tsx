import type { ReactNode } from "react";

import type { IntroKind } from "@/lib/intro";

interface CartoonSceneProps {
  kind: IntroKind;
  caption: string;
  /** Things that live outside the flying classroom (they stay behind or leave before the flight). */
  props?: ReactNode;
  /** The flying subject: the classroom as it will look on the first screen. */
  children: ReactNode;
}

/**
 * Shell shared by the cartoon intros: navy backdrop (`data-intro-bg`), the classroom in the middle
 * (`data-intro-subject`, same 640×440 proportions as the first-screen target) and a rounded caption.
 * Timelines live in app/styles/intro.css under `.intro-scene[data-kind="…"]`.
 */
export const CartoonScene = ({ kind, caption, props, children }: CartoonSceneProps): React.JSX.Element => (
  <div className="intro-scene intro-cartoon" data-kind={kind}>
    <div data-intro-bg className="absolute inset-0 bg-navy" />
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pb-20">
        <div data-intro-subject className="relative w-[min(80vw,52rem,calc((100dvh-18rem)*1.4545))]">
          {children}
        </div>
      </div>
      {props}
    </div>
    <p className="intro-caption-soft">{caption}</p>
  </div>
);
