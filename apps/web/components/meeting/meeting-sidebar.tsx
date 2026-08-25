import { useState } from "react"
import {
   IconMicrophone,
   IconMicrophoneOff,
   IconSend,
   IconMessage2,
   IconMoodSmile,
   IconArrowBackUp,
   IconPin,
   IconDoorEnter,
   IconScreenShare,
   IconRobot,
   IconCrown,
   IconShieldCheck,
   IconStar,
   IconVideo,
   IconVideoOff,
} from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
   chatEmotes,
   chatMessages,
   type ChatBadge,
   type ChatMessage,
   type Participant,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const BADGE_META: Record<
   ChatBadge,
   { label: string; icon: typeof IconCrown; className: string }
> = {
   host: { label: "Host", icon: IconCrown, className: "bg-primary/15 text-primary" },
   mod: { label: "Mod", icon: IconShieldCheck, className: "bg-success/15 text-success" },
   vip: { label: "VIP", icon: IconStar, className: "bg-warning/15 text-warning" },
   guest: {
      label: "Guest",
      icon: IconStar,
      className: "bg-secondary text-muted-foreground",
   },
   bot: {
      label: "Bot",
      icon: IconRobot,
      className: "bg-secondary text-muted-foreground",
   },
}

const EVENT_ICON = {
   join: IconDoorEnter,
   share: IconScreenShare,
   pin: IconPin,
   leave: IconDoorEnter,
}

function renderBody(body: string, colorVar: string) {
   return body.split(/(@[\w]+)/g).map((part, i) =>
      part.startsWith("@") ? (
         <span
            key={i}
            className="rounded-[3px] px-1 font-semibold"
            style={{
               color: `var(${colorVar})`,
               backgroundColor: `color-mix(in oklch, var(${colorVar}) 18%, transparent)`,
            }}
         >
            {part}
         </span>
      ) : (
         <span key={i}>{part}</span>
      )
   )
}

function ChatRow({ m }: { m: ChatMessage }) {
   const colorVar = m.colorVar ?? "--chat-3"

   if (m.kind === "event") {
      const Icon = EVENT_ICON[m.eventIcon ?? "join"]
      return (
         <div className="flex items-center gap-2 rounded-md border border-border/60 bg-secondary/40 px-2 py-1.5 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">
               <span className="font-medium text-foreground/90">{m.author}</span> {m.body}
            </span>
            <span className="ml-auto shrink-0 tabular-nums">{m.time}</span>
         </div>
      )
   }

   return (
      <div
         className={cn(
            "group relative -mx-1 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50",
            m.highlighted &&
               "bg-primary/10 ring-1 ring-inset ring-primary/30 hover:bg-primary/15"
         )}
      >
         {m.replyTo && (
            <div className="mb-1 flex items-center gap-1 text-[11px] text-muted-foreground">
               <IconArrowBackUp className="h-3 w-3" aria-hidden />
               Replying to <span className="font-medium">{m.replyTo}</span>
            </div>
         )}
         <p className="text-sm leading-relaxed">
            {m.badges?.map(b => {
               const meta = BADGE_META[b]
               const Icon = meta.icon
               return (
                  <span
                     key={b}
                     title={meta.label}
                     className={cn(
                        "mr-1 inline-flex h-4 w-4 translate-y-[2px] items-center justify-center rounded-[3px]",
                        meta.className
                     )}
                  >
                     <Icon className="h-3 w-3" aria-hidden />
                  </span>
               )
            })}
            <span className="font-semibold" style={{ color: `var(${colorVar})` }}>
               {m.author}
            </span>
            <span className="text-muted-foreground">: </span>
            <span className="break-words text-foreground/90">
               {renderBody(m.body, colorVar)}
            </span>
         </p>

         {m.reactions && (
            <div className="mt-1.5 flex flex-wrap gap-1">
               {m.reactions.map(r => (
                  <button
                     key={r.emoji}
                     type="button"
                     className={cn(
                        "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] transition-colors",
                        r.mine
                           ? "border-primary/40 bg-primary/15 text-foreground"
                           : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground"
                     )}
                  >
                     <span>{r.emoji}</span>
                     <span className="tabular-nums">{r.count}</span>
                  </button>
               ))}
            </div>
         )}

         <div className="absolute right-1 top-1 hidden items-center gap-0.5 rounded-md border border-border bg-popover p-0.5 shadow-sm group-hover:flex">
            {[
               { icon: IconMoodSmile, label: "React" },
               { icon: IconArrowBackUp, label: "Reply" },
               { icon: IconPin, label: "Pin" },
            ].map(({ icon: Icon, label }) => (
               <button
                  key={label}
                  type="button"
                  className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
               >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="sr-only">{label}</span>
               </button>
            ))}
            <span className="px-1 text-[10px] tabular-nums text-muted-foreground">
               {m.time}
            </span>
         </div>
      </div>
   )
}

function VoiceBars() {
   return (
      <span className="flex h-3.5 items-center gap-[2px]" aria-label="Speaking">
         {[0, 120, 240].map(d => (
            <span
               key={d}
               className="voice-bar block h-3 w-[2px] rounded-full bg-success"
               style={{ animationDelay: `${d}ms` }}
            />
         ))}
      </span>
   )
}

function ParticipantRow({ p }: { p: Participant }) {
   const color = p.colorVar ?? "--chat-3"
   const idle = p.presence === "idle"
   return (
      <div
         className={cn(
            "group relative flex items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 transition-colors",
            "hover:border-border hover:bg-accent/60",
            p.speaking && "border-success/25 bg-success/[0.06]"
         )}
      >
         <div className="relative shrink-0">
            <div
               className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold tracking-wide transition-opacity",
                  idle && "opacity-60"
               )}
               style={{
                  color: `var(${color})`,
                  backgroundColor: `color-mix(in oklab, var(${color}) 16%, transparent)`,
                  boxShadow: p.speaking
                     ? `0 0 0 2px color-mix(in oklab, var(--success) 60%, transparent)`
                     : `inset 0 0 0 1px color-mix(in oklab, var(${color}) 30%, transparent)`,
               }}
            >
               {p.initials}
            </div>
            <span
               className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                  idle ? "bg-muted-foreground" : "bg-success"
               )}
            />
         </div>

         <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
               <span
                  className={cn(
                     "truncate text-sm font-medium",
                     idle && "text-muted-foreground"
                  )}
               >
                  {p.name}
               </span>
               {p.isYou && (
                  <span className="rounded-[4px] bg-secondary px-1 py-px text-[10px] font-medium text-muted-foreground">
                     You
                  </span>
               )}
               {p.role === "Host" && (
                  <IconCrown className="h-3.5 w-3.5 text-warning" aria-label="Host" />
               )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
               {p.role && p.role !== "Host" && <span className="truncate">{p.role}</span>}
               {p.role && p.role !== "Host" && <span className="opacity-40">·</span>}
               <span className={cn(!idle && "text-success/80")}>
                  {idle ? "Idle" : "Active"}
               </span>
               {p.sharing && (
                  <>
                     <span className="opacity-40">·</span>
                     <span className="flex items-center gap-1 text-primary">
                        <IconScreenShare className="h-3 w-3" aria-hidden />
                        Sharing
                     </span>
                  </>
               )}
            </div>
         </div>

         <div className="flex shrink-0 items-center gap-2">
            {p.speaking && <VoiceBars />}
            {p.cameraOn ? (
               <IconVideo
                  className="h-4 w-4 text-muted-foreground/70"
                  aria-label="Camera on"
               />
            ) : (
               <IconVideoOff
                  className="h-4 w-4 text-muted-foreground/40"
                  aria-label="Camera off"
               />
            )}
            {p.micOn ? (
               <IconMicrophone
                  className={cn(
                     "h-4 w-4",
                     p.speaking ? "text-success" : "text-muted-foreground/70"
                  )}
                  aria-label="Microphone on"
               />
            ) : (
               <IconMicrophoneOff
                  className="h-4 w-4 text-destructive"
                  aria-label="Muted"
               />
            )}
         </div>
      </div>
   )
}

export function MeetingSidebar({
   participants,
   tab,
   onTabChange,
}: {
   participants: Participant[]
   tab: string
   onTabChange: (t: string) => void
}) {
   const [draft, setDraft] = useState("")
   const messages = chatMessages

   return (
      <Tabs
         value={tab}
         onValueChange={onTabChange}
         className="flex h-full flex-col gap-0"
      >
         <div className="border-b border-border p-3">
            <TabsList className="grid h-8 w-full grid-cols-2 gap-1 rounded-md border border-border bg-background p-1">
               <TabsTrigger
                  value="participants"
                  className="h-6 rounded-[5px] text-sm data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-none"
               >
                  People
                  <span className="ml-1.5 text-xs text-muted-foreground">
                     {participants.length}
                  </span>
               </TabsTrigger>
               <TabsTrigger
                  value="chat"
                  className="h-6 rounded-[5px] text-sm data-[state=active]:bg-secondary data-[state=active]:text-foreground data-[state=active]:shadow-none"
               >
                  Chat
               </TabsTrigger>
            </TabsList>
         </div>

         <TabsContent value="participants" className="mt-0 min-h-0 flex-1">
            <ScrollArea className="h-full">
               <div className="flex flex-col p-2">
                  {participants.length === 0 ? (
                     <p className="p-4 text-xs text-muted-foreground">
                        No participants in this room.
                     </p>
                  ) : (
                     <>
                        <div className="flex items-center justify-between px-2.5 pb-1.5 pt-1">
                           <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                              In this room
                           </span>
                           <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-success" />
                              {
                                 participants.filter(p => p.presence === "active").length
                              }{" "}
                              active
                           </span>
                        </div>
                        <div className="flex flex-col gap-1">
                           {participants.map(p => (
                              <ParticipantRow key={p.id} p={p} />
                           ))}
                        </div>
                     </>
                  )}
               </div>
            </ScrollArea>
         </TabsContent>

         <TabsContent value="chat" className="mt-0 flex min-h-0 flex-1 flex-col">
            <ScrollArea className="min-h-0 flex-1">
               <div className="flex flex-col gap-1 p-2">
                  {messages.length === 0 ? (
                     <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                        <IconMessage2
                           className="h-5 w-5 text-muted-foreground"
                           aria-hidden
                        />
                        <p className="text-sm font-medium">No messages yet</p>
                        <p className="text-xs text-muted-foreground">
                           Chat is cleared when the room expires.
                        </p>
                     </div>
                  ) : (
                     messages.map(m => <ChatRow key={m.id} m={m} />)
                  )}
               </div>
            </ScrollArea>

            <div className="shrink-0 border-t border-border">
               <div className="no-scrollbar flex items-center gap-1 overflow-x-auto px-2 pt-2">
                  {chatEmotes.map(e => (
                     <Tooltip key={e.name}>
                        <TooltipTrigger asChild>
                           <button
                              type="button"
                              onClick={() =>
                                 setDraft(d => (d ? `${d} ${e.char}` : e.char))
                              }
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-base leading-none transition-colors hover:bg-accent"
                           >
                              <span aria-hidden>{e.char}</span>
                              <span className="sr-only">Insert {e.name}</span>
                           </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">{e.name}</TooltipContent>
                     </Tooltip>
                  ))}
               </div>
               <form
                  className="flex items-center gap-2 p-2"
                  onSubmit={e => {
                     e.preventDefault()
                     setDraft("")
                  }}
               >
                  <Input
                     value={draft}
                     onChange={e => setDraft(e.target.value)}
                     placeholder="Send a message"
                     className="h-8 text-sm"
                     aria-label="Send a message"
                  />
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button
                           type="submit"
                           size="icon"
                           className="h-8 w-8"
                           disabled={!draft.trim()}
                        >
                           <IconSend className="h-4 w-4" />
                           <span className="sr-only">Send message</span>
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent side="top">Send</TooltipContent>
                  </Tooltip>
               </form>
            </div>
         </TabsContent>
      </Tabs>
   )
}
