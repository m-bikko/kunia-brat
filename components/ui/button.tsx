import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * AXIS button styles: sharp, flat, label left / icon right when stretched.
 * Use `buttonVariants()` on links (most CTAs are links) or `<Button>` for real buttons.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-3 border border-transparent font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 outline-none select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-brand-hover",
        ink: "bg-ink text-white hover:bg-ink-2",
        outline: "border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
        light: "bg-white text-ink hover:bg-brand-soft",
        ghostLight: "border-white/30 text-white hover:border-white hover:bg-white/10",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-5 text-[15px]",
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
