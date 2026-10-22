import { cva, type VariantProps } from "class-variance-authority";

/**
 * v2 buttons: pills with a navy outline and a solid "sticker" shadow; they lift on hover and press
 * down on click. Use `softButton()` on links (most CTAs are links) or on a <button>.
 */
export const softButton = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full border-[2.5px] border-navy text-center font-extrabold transition-[translate,box-shadow,background-color,color] duration-150 select-none active:translate-y-[3px] active:shadow-none disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:translate-y-0 sm:whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white shadow-sticker-sm hover:-translate-y-0.5 hover:shadow-sticker motion-reduce:hover:translate-y-0",
        navy: "bg-navy text-white shadow-sticker-sm hover:-translate-y-0.5 hover:shadow-sticker motion-reduce:hover:translate-y-0",
        outline: "bg-white text-navy shadow-sticker-sm hover:-translate-y-0.5 hover:bg-sky hover:shadow-sticker motion-reduce:hover:translate-y-0",
        light: "border-white bg-white text-navy shadow-[0_3px_0_var(--sun)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--sun)] motion-reduce:hover:translate-y-0",
      },
      size: {
        md: "min-h-11 px-5 py-2 text-[15px]",
        lg: "min-h-14 px-7 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type SoftButtonProps = VariantProps<typeof softButton>;
