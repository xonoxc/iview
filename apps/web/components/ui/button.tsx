import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-surface-3 text-foreground border border-border-strong hover:bg-surface-3/80 shadow-xs",
        destructive: "bg-danger/90 text-white border border-danger/60 hover:bg-danger",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-surface hover:text-foreground",
        secondary:
          "bg-surface text-foreground border border-border hover:bg-surface-2 hover:border-border-strong",
        ghost: "text-muted-foreground hover:bg-surface hover:text-foreground",
        link: "text-accent underline-offset-4 hover:underline",
        primary:
          "bg-accent text-accent-foreground border border-accent/70 hover:brightness-110 shadow-xs",
      },
      size: {
        default: "h-7 px-2.5",
        sm: "h-6 px-2 text-[12px]",
        lg: "h-9 px-3",
        icon: "h-7 w-7",
        "icon-sm": "h-6 w-6 [&_svg]:size-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
