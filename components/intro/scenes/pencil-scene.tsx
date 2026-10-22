import { CartoonScene } from "@/components/intro/scenes/cartoon-scene";
import { ClassroomArt } from "@/components/v2/art/classroom";
import { PencilArt } from "@/components/v2/art/pencil";

/**
 * «Карандаш рисует»: a pencil with a face flies in and draws the classroom in white lines as it moves
 * (room, window, panel, bookcase, desks), colour pops into every part, the pencil bows and leaves, and the
 * coloured classroom flies into the first screen. The pencil moves in container units of the classroom.
 */
export const PencilScene = ({ caption }: { caption: string }): React.JSX.Element => (
  <CartoonScene kind="pencil" caption={caption}>
    <div className="intro-pencil-stage relative">
      <ClassroomArt outline className="intro-pencil-outline absolute inset-0" />
      <ClassroomArt className="intro-pencil-color relative" />
      <div className="intro-pencil absolute top-0 left-0">
        <PencilArt className="block h-auto w-full" />
      </div>
    </div>
  </CartoonScene>
);
