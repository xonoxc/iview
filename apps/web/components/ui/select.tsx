"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { IconCheck, IconChevronDown, IconChevronUp } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
   return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
   return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
   return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
   className,
   size = "default",
   children,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
   size?: "sm" | "default"
}) {
   return (
      <SelectPrimitive.Trigger
         data-slot="select-trigger"
         data-size={size}
         className={cn(
            "flex w-fit items-center justify-between gap-2 whitespace-nowrap rounded-md border border-border bg-transparent text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-45 data-placeholder:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            size === "default"
               ? "h-7 px-2"
               : "h-6 px-1.5 text-[12px] [&_svg:not([class*='size-'])]:size-3.5",
            className
         )}
         {...props}
      >
         {children}
         <SelectPrimitive.Icon asChild>
            <IconChevronDown className="size-4 opacity-50" />
         </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
   )
}

function SelectContent({
   className,
   children,
   position = "popper",
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
   return (
      <SelectPrimitive.Portal>
         <SelectPrimitive.Content
            data-slot="select-content"
            className={cn(
               "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border border-border-strong bg-surface-2 text-foreground shadow-lg",
               position === "popper" && "data-[side=top]:-translate-y-1",
               className
            )}
            position={position}
            {...props}
         >
            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
               <IconChevronUp className="size-4" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport
               className={cn(
                  "p-1",
                  position === "popper" &&
                     "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1"
               )}
            >
               {children}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
               <IconChevronDown className="size-4" />
            </SelectPrimitive.ScrollDownButton>
         </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
   )
}

function SelectLabel({
   className,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
   return (
      <SelectPrimitive.Label
         data-slot="select-label"
         className={cn(
            "px-2 py-1.5 text-[12px] font-medium text-muted-foreground",
            className
         )}
         {...props}
      />
   )
}

function SelectItem({
   className,
   children,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
   return (
      <SelectPrimitive.Item
         data-slot="select-item"
         className={cn(
            "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-[13px] outline-none transition-colors focus:bg-surface-3 data-disabled:pointer-events-none data-disabled:opacity-45",
            className
         )}
         {...props}
      >
         <span className="absolute right-2 flex size-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
               <IconCheck className="size-4 text-accent" />
            </SelectPrimitive.ItemIndicator>
         </span>
         <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
   )
}

function SelectSeparator({
   className,
   ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
   return (
      <SelectPrimitive.Separator
         data-slot="select-separator"
         className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
         {...props}
      />
   )
}

export {
   Select,
   SelectGroup,
   SelectValue,
   SelectTrigger,
   SelectContent,
   SelectLabel,
   SelectItem,
   SelectSeparator,
}
