"use client"

import { useState } from "react"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function ShellLine({ prompt, command }: { prompt: string; command: string }) {
   return (
      <div className="whitespace-pre-wrap">
         <span className="text-muted">{prompt}</span>
         <span className="text-foreground">{command}</span>
      </div>
   )
}

export function TerminalPanel() {
   const [collapsed, setCollapsed] = useState(false)

   return (
      <div className="flex h-full min-h-0 flex-col bg-background">
         <div className="flex h-[34px] shrink-0 items-center justify-between border-b border-border bg-surface pr-1.5">
            <Tabs defaultValue="terminal" className="gap-0 pl-1.5">
               <TabsList>
                  <TabsTrigger value="terminal">Terminal</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
               </TabsList>
            </Tabs>

            <Tooltip>
               <TooltipTrigger asChild>
                  <Button
                     variant="ghost"
                     size="icon-sm"
                     aria-expanded={!collapsed}
                     onClick={() => setCollapsed(prev => !prev)}
                  >
                     {collapsed ? (
                        <IconChevronUp className="size-4" />
                     ) : (
                        <IconChevronDown className="size-4" />
                     )}
                  </Button>
               </TooltipTrigger>
               <TooltipContent side="top">{collapsed ? "Expand" : "Collapse"}</TooltipContent>
            </Tooltip>
         </div>

         {!collapsed && (
            <div className="min-h-0 flex-1 overflow-auto px-3 py-2 font-mono text-[12px] leading-[1.7] text-muted-foreground">
               <ShellLine prompt="$ " command="go run main.go" />
               <div className="text-foreground/90">Hello from iview</div>
               <div>&nbsp;</div>
            </div>
         )}
      </div>
   )
}
