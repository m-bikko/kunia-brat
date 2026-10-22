import { BlocksScene } from "@/components/intro/scenes/blocks-scene";
import { BlueprintScene } from "@/components/intro/scenes/blueprint-scene";
import { PencilScene } from "@/components/intro/scenes/pencil-scene";
import { PopScene } from "@/components/intro/scenes/pop-scene";
import type { IntroKind } from "@/lib/intro";

/** The markup of one intro kind. Every scene is a server-rendered CSS timeline (app/styles/intro.css). */
export const IntroScene = ({ kind, caption }: { kind: IntroKind; caption: string }): React.JSX.Element | null => {
  switch (kind) {
    case "blueprint":
      return <BlueprintScene caption={caption} />;
    case "pop":
      return <PopScene caption={caption} />;
    case "blocks":
      return <BlocksScene caption={caption} />;
    case "pencil":
      return <PencilScene caption={caption} />;
    default:
      return null;
  }
};
