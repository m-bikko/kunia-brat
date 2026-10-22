import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * AXIS button styles. Use `buttonVariants()` on links (most CTAs here are links),
 * or `<Button>` for real buttons. Controls share the 12px `rounded-control` radius.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-control border border-transparent font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-(--ease-out-expo) outline-none select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.1em]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white shadow-[0_10px_30px_-12px_rgb(48_89_223/0.65)] hover:bg-brand-hover hover:shadow-[0_14px_34px_-12px_rgb(48_89_223/0.75)]",
        outline:
          "border-line-strong bg-surface text-ink hover:border-brand hover:text-brand",
        light:
          "bg-white text-ink-deep hover:bg-brand-soft",
        ghostLight:
          "border-white/25 text-white hover:border-white/60 hover:bg-white/10",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-5 text-[0.95rem]",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
