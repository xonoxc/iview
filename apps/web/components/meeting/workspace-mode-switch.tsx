import { IconCode, IconLayoutColumns, IconVideo } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type WorkspaceMode = "video" | "code" | "split"

const MODES: { id: WorkspaceMode; label: string; icon: typeof IconCode }[] = [
   { id: "video", label: "Video", icon: IconVideo },
   { id: "code", label: "Code", icon: IconCode },
   { id: "split", label: "Split", icon: IconLayoutColumns },
]

export function WorkspaceModeSwitch({
   mode,
   onChange,
   className,
}: {
   mode: WorkspaceMode
   onChange: (m: WorkspaceMode) => void
   className?: string
}) {
   return (
      <div
         role="tablist"
         aria-label="Workspace mode"
         className={cn(
            "flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5",
            className
         )}
      >
         {MODES.map(m => {
            const Icon = m.icon
            const active = mode === m.id
            return (
               <Tooltip key={m.id}>
                  <TooltipTrigger asChild>
                     <button
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(m.id)}
                        className={cn(
                           "flex h-6 items-center gap-1.5 rounded-[5px] px-2 text-xs font-medium transition-colors",
                           active
                              ? "bg-secondary text-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                     >
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                        <span className="hidden md:inline">{m.label}</span>
                     </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{m.label} workspace</TooltipContent>
               </Tooltip>
            )
         })}
      </div>
   )
}
