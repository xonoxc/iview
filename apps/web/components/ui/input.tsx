import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
   return (
      <input
         type={type}
         data-slot="input"
         className={cn(
            "flex h-8 w-full rounded-md border border-border bg-surface px-2.5 text-[13px] text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-45",
            className
         )}
         {...props}
      />
   )
}

export { Input }
