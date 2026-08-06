"use client"

import { useState } from "react"
import {
   IconCheck,
   IconCircleFilled,
   IconCode,
   IconCopy,
   IconDots,
   IconKeyboard,
   IconLink,
   IconLogout2,
   IconSettings,
   IconUserPlus,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const ROOM_LINK = "https://iview.dev/room/backend-session"

function CopyLinkButton() {
   const [copied, setCopied] = useState(false)

   const copy = async () => {
      try {
         await navigator.clipboard.writeText(ROOM_LINK)
         setCopied(true)
         setTimeout(() => setCopied(false), 1500)
      } catch {
         setCopied(false)
      }
   }

   return (
      <Button size="sm" onClick={copy} className="gap-1.5">
         {copied ? <IconCheck className="text-live" /> : <IconCopy />}
         {copied ? "Copied" : "Copy"}
      </Button>
   )
}

export function RoomHeader() {
   return (
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-background px-10">
         <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded-[5px] border border-border-strong bg-surface-2">
               <IconCode className="size-3.5 text-accent" />
            </div>
            <nav className="flex min-w-0 items-center gap-1.5 text-[13px] px-10">
               <span className="font-medium text-foreground">iview</span>
               <span className="text-muted">/</span>
               <span className="truncate text-muted-foreground">backend-session</span>
            </nav>
         </div>

         <div className="flex shrink-0 items-center gap-1.5">
            <div className="mr-1 flex items-center gap-1.5 text-muted-foreground">
               <IconCircleFilled className="size-2 fill-live text-live" />
               <span className="text-[12px] font-medium">Live</span>
            </div>

            <Dialog>
               <Tooltip>
                  <DialogTrigger asChild>
                     <TooltipTrigger asChild>
                        <Button variant="primary" size="sm" className="gap-1.5">
                           <IconLink className="size-3.5" />
                           Share
                        </Button>
                     </TooltipTrigger>
                  </DialogTrigger>
               </Tooltip>
               <DialogContent className="max-w-sm">
                  <DialogHeader>
                     <DialogTitle>Invite people to this room</DialogTitle>
                     <DialogDescription>
                        Anyone with the link can join this live coding session.
                     </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-2">
                     <div className="flex h-7 flex-1 items-center rounded-md border border-border bg-background px-2 font-mono text-[12px] text-muted-foreground">
                        {ROOM_LINK}
                     </div>
                     <CopyLinkButton />
                  </div>
               </DialogContent>
            </Dialog>

            <Tooltip>
               <DropdownMenu>
                  <TooltipTrigger asChild>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                           <IconSettings className="size-4" />
                        </Button>
                     </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Room settings</TooltipContent>
                  <DropdownMenuContent align="end" className="w-56">
                     <DropdownMenuLabel>Room</DropdownMenuLabel>
                     <DropdownMenuItem>
                        <IconUserPlus className="size-4" />
                        Invite people
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <IconKeyboard className="size-4" />
                        Keyboard shortcuts
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem variant="destructive">
                        <IconLogout2 className="size-4" />
                        Leave room
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </Tooltip>

            <Tooltip>
               <DropdownMenu>
                  <TooltipTrigger asChild>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                           <IconDots className="size-4" />
                        </Button>
                     </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">More options</TooltipContent>
                  <DropdownMenuContent align="end" className="w-56">
                     <DropdownMenuItem>
                        <IconCopy className="size-4" />
                        Copy room link
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem>
                        <IconKeyboard className="size-4" />
                        Toggle fullscreen
                     </DropdownMenuItem>
                     <DropdownMenuItem>
                        <IconSettings className="size-4" />
                        Preferences
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem variant="destructive">
                        <IconLogout2 className="size-4" />
                        End session
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </Tooltip>
         </div>
      </header>
   )
}
