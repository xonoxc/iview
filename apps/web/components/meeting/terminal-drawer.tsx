import { useState } from "react"
import {
   IconChevronDown,
   IconChevronUp,
   IconLayoutColumns,
   IconPlus,
   IconSettings,
   IconSquareRoundedChevronRight,
   IconTrash,
   IconX,
} from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { terminalLines } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const LINE_CLASS: Record<string, string> = {
   cmd: "text-foreground",
   out: "text-foreground/75",
   ok: "text-[var(--code-string)]",
   warn: "text-[var(--code-number)]",
   err: "text-destructive",
   dim: "text-muted-foreground",
}

const PANELS = ["Problems", "Output", "Debug Console", "Terminal", "Ports"] as const

export function TerminalDrawer({ onClose }: { onClose: () => void }) {
   const [panel, setPanel] = useState<(typeof PANELS)[number]>("Terminal")

   return (
      <div className="flex h-56 shrink-0 flex-col border-t border-border bg-background">
         <div className="flex h-9 shrink-0 items-center gap-1 pl-3 pr-1.5">
            <div className="flex min-w-0 items-center gap-1 overflow-x-auto no-scrollbar">
               {PANELS.map(p => (
                  <button
                     key={p}
                     type="button"
                     onClick={() => setPanel(p)}
                     className={cn(
                        "relative shrink-0 px-2 py-1.5 text-xs transition-colors",
                        panel === p
                           ? "text-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-[1.5px] after:rounded-full after:bg-primary"
                           : "text-muted-foreground hover:text-foreground"
                     )}
                  >
                     {p}
                     {p === "Problems" && (
                        <span className="ml-1.5 rounded-sm bg-secondary px-1 text-[10px] text-muted-foreground">
                           1
                        </span>
                     )}
                  </button>
               ))}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-0.5">
               <div className="mr-1 hidden items-center gap-1.5 rounded-sm px-1.5 py-1 text-xs text-muted-foreground sm:flex">
                  <IconSquareRoundedChevronRight className="h-3.5 w-3.5" aria-hidden />
                  fish
               </div>
               {[
                  { icon: IconPlus, label: "New terminal" },
                  { icon: IconChevronDown, label: "Select shell" },
                  { icon: IconSettings, label: "Terminal settings" },
                  { icon: IconLayoutColumns, label: "Split terminal" },
                  { icon: IconTrash, label: "Kill terminal" },
                  { icon: IconChevronUp, label: "Maximize panel" },
                  { icon: IconX, label: "Close panel", action: onClose },
               ].map(({ icon: Icon, label, action }) => (
                  <Tooltip key={label}>
                     <TooltipTrigger asChild>
                        <button
                           type="button"
                           onClick={action}
                           className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                           <Icon className="h-3.5 w-3.5" />
                           <span className="sr-only">{label}</span>
                        </button>
                     </TooltipTrigger>
                     <TooltipContent side="top">{label}</TooltipContent>
                  </Tooltip>
               ))}
            </div>
         </div>

         <ScrollArea className="min-h-0 flex-1">
            <div className="px-4 pb-3 font-mono text-[12.5px] leading-[1.6]">
               {panel === "Terminal" && (
                  <>
                     {terminalLines.map(l => (
                        <div
                           key={l.id}
                           className={cn("whitespace-pre-wrap", LINE_CLASS[l.kind])}
                        >
                           {l.text}
                        </div>
                     ))}
                     <div className="mt-3 font-semibold text-[var(--code-fn)]">
                        relay-session
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-muted-foreground/60">○</span>
                        <span className="text-[var(--code-string)]">➜</span>
                        <span className="inline-block h-[15px] w-[7px] animate-pulse bg-foreground/80" />
                     </div>
                  </>
               )}
               {panel === "Problems" && (
                  <div className="text-[var(--code-number)]">
                     src/parser/guard.ts:41:12 — nested import guard may recurse
                     infinitely
                  </div>
               )}
               {panel === "Output" && (
                  <div className="text-muted-foreground">
                     [14:08:02] Sync complete — 0 conflicts
                  </div>
               )}
               {panel === "Debug Console" && (
                  <div className="text-muted-foreground">Debugger not attached.</div>
               )}
               {panel === "Ports" && (
                  <div className="text-muted-foreground">
                     8080 → https://localhost:8080 (forwarded)
                  </div>
               )}
            </div>
         </ScrollArea>
      </div>
   )
}
