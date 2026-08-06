import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
   return (
      <label
         data-slot="label"
         className={cn(
            "text-[12px] font-medium leading-none text-muted-foreground select-none",
            className
         )}
         {...props}
      />
   )
}

export { Label }
