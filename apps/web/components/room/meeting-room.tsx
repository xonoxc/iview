"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
   IconCheck,
   IconCommand,
   IconCopy,
   IconDotsVertical,
   IconLayoutSidebarRightCollapse,
   IconLayoutSidebarRightExpand,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConnectionStatus } from "@/components/meeting/connection-status"
import { VideoGrid } from "@/components/meeting/video-grid"
import { VideoRail } from "@/components/meeting/video-rail"
import { MeetingSidebar } from "@/components/meeting/meeting-sidebar"
import { MeetingControls } from "@/components/meeting/meeting-controls"
import { CommandCenter } from "@/components/meeting/command-center"
import { CodeWorkspace } from "@/components/meeting/code-workspace"
import {
   WorkspaceModeSwitch,
   type WorkspaceMode,
} from "@/components/meeting/workspace-mode-switch"
import { participants as mockParticipants, type ConnectionState, type Participant } from "@/lib/mock-data"
import { realtimeClient } from "@/lib/realtime-client"
import { useEnterRoom } from "@/features/room/hooks/use-enter-room"
import { cn } from "@/lib/utils"

function initialsFor(name: string) {
   return name
      .split(/[\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]!.toUpperCase())
      .join("")
}

export function MeetingRoom({ roomId }: { roomId: string }) {
   const router = useRouter()
   const roomQuery = useEnterRoom(roomId)
   const [micOn, setMicOn] = useState(true)
   const [cameraOn, setCameraOn] = useState(true)
   const [sharing, setSharing] = useState(false)
   const [sidebarOpen, setSidebarOpen] = useState(true)
   const [tab, setTab] = useState("participants")
   const [connection, setConnection] = useState<ConnectionState>("disconnected")
   const [mode, setMode] = useState<WorkspaceMode>("video")
   const [mobilePanel, setMobilePanel] = useState(false)
   const [copied, setCopied] = useState(false)
   const [commandOpen, setCommandOpen] = useState(false)
   const [terminalOpen, setTerminalOpen] = useState(false)
   const [participants, setParticipants] = useState<Participant[]>(mockParticipants)

   useEffect(() => {
      realtimeClient.connect(roomId)

      const unsubscribeStatus = realtimeClient.subscribeStatus(status => {
         setConnection(status)
      })
      const unsubscribeMessages = realtimeClient.subscribe(message => {
         if (message.type === "presence.join") {
            setParticipants(current => {
               if (current.some(p => p.id === message.from)) return current
               return [
                  ...current,
                  {
                     id: message.from,
                     name: message.from,
                     initials: initialsFor(message.from),
                     micOn: true,
                     cameraOn: true,
                     presence: "active",
                     colorVar: `--chat-${(current.length % 8) + 1}`,
                  },
               ]
            })
         }
      })

      return () => {
         unsubscribeStatus()
         unsubscribeMessages()
         realtimeClient.disconnect()
      }
   }, [roomId])

   const roomTitle = roomQuery.data?.title ?? "Session room"
   const title = roomQuery.isLoading ? "Loading…" : roomTitle

   const copyInvite = () => {
      navigator.clipboard?.writeText(`${window.location.origin}/room/${roomId}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
   }

   const openPanel = (panel: "participants" | "chat") => {
      setTab(panel)
      if (window.matchMedia("(min-width: 1024px)").matches) setSidebarOpen(true)
      else setMobilePanel(true)
   }

   const leave = () => {
      realtimeClient.disconnect()
      router.push("/")
   }

   const people = participants.map(p => (p.isYou ? { ...p, micOn, cameraOn } : p))

   return (
      <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
         <header className="grid h-14 shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border px-4 sm:px-6">
            <Breadcrumb className="min-w-0">
               <BreadcrumbList className="flex-nowrap gap-1.5 sm:gap-2">
                  <BreadcrumbItem className="shrink-0">
                     <BreadcrumbLink asChild>
                        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground hover:text-primary">
                           Relay
                        </Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="shrink-0 text-muted-foreground/50">/</BreadcrumbSeparator>
                  <BreadcrumbItem className="hidden shrink-0 sm:flex">
                     <BreadcrumbLink asChild>
                        <Link href="/" className="text-sm">
                           Sessions
                        </Link>
                     </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden shrink-0 text-muted-foreground/50 sm:flex">/</BreadcrumbSeparator>
                  <BreadcrumbItem className="min-w-0">
                     <BreadcrumbPage className="truncate text-sm font-medium">{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                  <span className="hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground md:inline">
                     {roomId}
                  </span>
               </BreadcrumbList>
            </Breadcrumb>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
               <WorkspaceModeSwitch mode={mode} onChange={setMode} />
               <Separator orientation="vertical" className="hidden h-5 sm:block" />
               <div className="hidden sm:block">
                  <ConnectionStatus state={connection} />
               </div>
               <Separator orientation="vertical" className="hidden h-5 sm:block" />
               <span className="hidden text-xs text-muted-foreground lg:inline">
                  {people.length} participants
               </span>
               <Button
                  variant="outline"
                  size="sm"
                  className="hidden h-8 gap-2 px-2.5 text-xs text-muted-foreground md:inline-flex"
                  onClick={() => setCommandOpen(true)}
               >
                  <IconCommand className="h-3.5 w-3.5" />
                  Commands
                  <kbd className="rounded border border-border px-1 text-[10px] leading-4">⌥K</kbd>
               </Button>

               <Button
                  variant="outline"
                  size="sm"
                  className="hidden h-8 gap-1.5 px-2.5 text-xs sm:inline-flex"
                  onClick={copyInvite}
               >
                  {copied ? (
                     <IconCheck className="h-3.5 w-3.5 text-primary" />
                  ) : (
                     <IconCopy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Link copied" : "Copy invite"}
               </Button>

               <Tooltip>
                  <TooltipTrigger asChild>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                           if (window.matchMedia("(min-width: 1024px)").matches) {
                              setSidebarOpen(v => !v)
                           } else {
                              setMobilePanel(true)
                           }
                        }}
                     >
                        {sidebarOpen ? (
                           <IconLayoutSidebarRightCollapse className="h-4 w-4" />
                        ) : (
                           <IconLayoutSidebarRightExpand className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle side panel</span>
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                     {sidebarOpen ? "Hide panel" : "Show panel"}
                  </TooltipContent>
               </Tooltip>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconDotsVertical className="h-4 w-4" />
                        <span className="sr-only">Room options</span>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                     <DropdownMenuItem onSelect={() => setConnection("connecting")}>
                        Preview connecting
                     </DropdownMenuItem>
                     <DropdownMenuItem onSelect={() => setConnection("reconnecting")}>
                        Preview reconnecting
                     </DropdownMenuItem>
                     <DropdownMenuItem onSelect={() => setConnection("disconnected")}>
                        Preview disconnected
                     </DropdownMenuItem>
                     <DropdownMenuItem onSelect={() => setConnection("connected")}>
                        Preview connected
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </header>

         <div className="flex min-h-0 flex-1">
            <main className="relative flex min-w-0 flex-1 flex-col">
               {mode === "video" && (
                  <div className="min-h-0 flex-1 p-4 sm:p-6">
                     <VideoGrid participants={people} screenSharing={sharing} />
                  </div>
               )}

               {mode === "code" && (
                  <div className="flex min-h-0 flex-1 flex-col">
                     <VideoRail participants={people} />
                     <div className="min-h-0 flex-1">
                        <CodeWorkspace
                           terminalOpen={terminalOpen}
                           onTerminalOpenChange={setTerminalOpen}
                        />
                     </div>
                  </div>
               )}

               {mode === "split" && (
                  <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                     <div className="lg:hidden">
                        <VideoRail participants={people} />
                     </div>
                     <div className="hidden min-h-0 w-[280px] shrink-0 flex-col border-r border-border bg-sidebar/40 p-4 lg:flex xl:w-[320px]">
                        <VideoGrid participants={people} screenSharing={sharing} layout="column" />
                     </div>
                     <div className="min-h-0 flex-1">
                        <CodeWorkspace
                           compact
                           terminalOpen={terminalOpen}
                           onTerminalOpenChange={setTerminalOpen}
                        />
                     </div>
                  </div>
               )}

               <div className="flex shrink-0 justify-center border-t border-border bg-background px-4 py-3">
                  <MeetingControls
                     micOn={micOn}
                     cameraOn={cameraOn}
                     sharing={sharing}
                     sidebarOpen={sidebarOpen}
                     onToggleMic={() => setMicOn(v => !v)}
                     onToggleCamera={() => setCameraOn(v => !v)}
                     onToggleShare={() => setSharing(v => !v)}
                     onOpenPanel={openPanel}
                     onLeave={leave}
                  />
               </div>

               <CommandCenter
                  open={commandOpen}
                  onOpenChange={setCommandOpen}
                  actions={{
                     micOn,
                     cameraOn,
                     sharing,
                     terminalOpen,
                     toggleMic: () => setMicOn(v => !v),
                     toggleCamera: () => setCameraOn(v => !v),
                     toggleShare: () => setSharing(v => !v),
                     toggleTerminal: () => {
                        setTerminalOpen(v => !v)
                        if (mode === "video") setMode("code")
                     },
                     setMode,
                     openPanel,
                     copyInvite,
                     leave,
                  }}
               />
            </main>

            <aside
               className={cn(
                  "hidden shrink-0 overflow-hidden border-l border-border bg-sidebar transition-[width] duration-200 ease-out lg:block",
                  sidebarOpen ? "w-[300px] xl:w-[320px]" : "w-0",
               )}
               aria-hidden={!sidebarOpen}
            >
               <div className="h-full w-[300px] xl:w-[320px]">
                  <MeetingSidebar participants={people} tab={tab} onTabChange={setTab} />
               </div>
            </aside>

            <Sheet open={mobilePanel} onOpenChange={setMobilePanel}>
               <SheetContent side="right" className="w-[88vw] max-w-sm border-border bg-sidebar p-0 lg:hidden">
                  <SheetTitle className="sr-only">Session panel</SheetTitle>
                  <MeetingSidebar participants={people} tab={tab} onTabChange={setTab} />
               </SheetContent>
            </Sheet>
         </div>
      </div>
   )
}