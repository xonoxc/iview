import { IconMicrophoneOff, IconScreenShare, IconVideoOff } from "@tabler/icons-react"
import type { Participant } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function Tile({
   p,
   className,
   compact,
}: {
   p: Participant
   className?: string
   compact?: boolean
}) {
   const tint = p.colorVar ? `var(${p.colorVar})` : "var(--muted-foreground)"
   return (
      <div
         className={cn(
            "tile-surface group relative isolate overflow-hidden rounded-lg border bg-card transition-colors",
            p.speaking
               ? "border-primary/60 ring-1 ring-primary/30"
               : "border-border hover:border-border/80",
            className
         )}
      >
         {p.cameraOn ? (
            <div className="absolute inset-0 bg-accent" />
         ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pb-7">
               <div
                  className="tile-avatar flex items-center justify-center rounded-full border font-semibold"
                  style={{
                     color: tint,
                     borderColor: `color-mix(in oklab, ${tint} 35%, transparent)`,
                     backgroundColor: `color-mix(in oklab, ${tint} 12%, var(--secondary))`,
                  }}
               >
                  {p.initials}
               </div>
               {!compact && (
                  <div className="tile-caption items-center gap-1.5 text-[11px] text-muted-foreground">
                     <IconVideoOff className="h-3.5 w-3.5" aria-hidden />
                     Camera off
                  </div>
               )}
            </div>
         )}

         <div
            className={cn(
               "absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-background/90 via-background/60 to-transparent",
               compact ? "px-1.5 pb-1 pt-4" : "px-2.5 pb-1.5 pt-6"
            )}
         >
            <span
               className={cn(
                  "min-w-0 flex-1 truncate font-medium leading-none text-foreground",
                  compact ? "text-[11px]" : "text-xs"
               )}
            >
               {p.isYou && !compact ? `${p.name} · You` : p.name}
            </span>
            {p.speaking && (
               <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--primary)" }}
                  aria-hidden
               />
            )}
            {!p.micOn && (
               <IconMicrophoneOff
                  className={cn(
                     "shrink-0 text-muted-foreground",
                     compact ? "h-3 w-3" : "h-3.5 w-3.5"
                  )}
                  aria-label={`${p.name} is muted`}
               />
            )}
         </div>
      </div>
   )
}

export function VideoGrid({
   participants,
   screenSharing,
   layout = "grid",
}: {
   participants: Participant[]
   screenSharing?: boolean
   layout?: "grid" | "column"
}) {
   if (participants.length === 0) {
      return (
         <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border">
            <div className="max-w-xs text-center">
               <p className="text-sm font-medium text-foreground">
                  Nobody else is here yet
               </p>
               <p className="mt-1 text-xs text-muted-foreground">
                  Share the room link to bring people into the session.
               </p>
            </div>
         </div>
      )
   }

   if (layout === "column") {
      return (
         <div className="flex h-full min-h-0 flex-col gap-2.5 overflow-y-auto pr-0.5">
            {participants.map(p => (
               <Tile key={p.id} p={p} className="aspect-video w-full shrink-0" />
            ))}
         </div>
      )
   }

   if (screenSharing) {
      const main = participants[0]!
      return (
         <div className="flex h-full flex-col gap-3">
            <div className="relative flex-1 overflow-hidden rounded-md border border-border bg-card">
               <div className="absolute inset-0 bg-accent/40" />
               <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-border bg-background/80 px-2 py-1 text-xs text-foreground">
                  <IconScreenShare className="h-3.5 w-3.5" aria-hidden />
                  {main.name} is presenting
               </div>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
               {participants.map(p => (
                  <Tile key={p.id} p={p} className="aspect-video" compact />
               ))}
            </div>
         </div>
      )
   }

   const n = participants.length
   const cols =
      n === 1
         ? "grid-cols-1"
         : n === 2
           ? "grid-cols-1 md:grid-cols-2"
           : n <= 4
             ? "grid-cols-1 sm:grid-cols-2"
             : "grid-cols-2 lg:grid-cols-3"

   return (
      <div
         className={cn(
            "grid h-full min-h-0 gap-3",
            cols,
            n <= 4 && n > 2 && "grid-rows-2"
         )}
      >
         {participants.map(p => (
            <Tile key={p.id} p={p} className="min-h-0" />
         ))}
      </div>
   )
}
