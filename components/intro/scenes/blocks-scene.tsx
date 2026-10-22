import { CartoonScene } from "@/components/intro/scenes/cartoon-scene";
import { ClassroomArt } from "@/components/v2/art/classroom";

/** Toy shapes that tumble down beside the classroom and stay as decoration until the hand-off. */
const shapes = [
  { className: "left-[6%] bottom-[9rem] size-16 rounded-full bg-sun", at: "0.15s", turn: "-30deg" },
  { className: "left-[13%] bottom-[9rem] h-12 w-24 rounded-full bg-coral", at: "0.35s", turn: "24deg" },
  { className: "left-[7%] bottom-[calc(9rem+4.2rem)] size-12 rounded-[14px] bg-sky", at: "0.6s", turn: "-45deg" },
  { className: "right-[7%] bottom-[9rem] size-20 rounded-[22px] bg-brand", at: "0.25s", turn: "35deg" },
  { className: "right-[15%] bottom-[9rem] size-14 rounded-full bg-white", at: "0.5s", turn: "-20deg" },
  { className: "right-[8%] bottom-[calc(9rem+5.2rem)] h-10 w-20 rounded-full bg-sun", at: "0.75s", turn: "18deg" },
] as const;

/**
 * «Фигуры-кубики»: the floor slides in and every part of the classroom tumbles down and bounces into
 * place like toy blocks (walls, window, bookcase, panel, desks one by one, clock, books, globe), the room
 * gives a happy «чпок», then flies into the first screen. Toy shapes pile up at the sides.
 */
export const BlocksScene = ({ caption }: { caption: string }): React.JSX.Element => (
  <CartoonScene
    kind="blocks"
    caption={caption}
    props={
      <div data-intro-chrome className="absolute inset-0 hidden md:block">
        {shapes.map(({ className, at, turn }) => (
          <span
            key={`${className}-${at}`}
            className={`intro-block absolute border-[3px] border-navy ${className}`}
            style={{ "--at": at, "--turn": turn }}
          />
        ))}
      </div>
    }
  >
    <ClassroomArt />
  </CartoonScene>
);
