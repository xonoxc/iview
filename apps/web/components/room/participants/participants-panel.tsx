"use client"

import { IconUserPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ParticipantVideo } from "@/components/room/participants/participant-video"
import { CallControls } from "@/components/room/participants/call-controls"

const PARTICIPANTS = [
  { name: "Appy", initials: "A", micOn: true, cameraOn: true, isSpeaking: true },
  { name: "Bao", initials: "B", micOn: false, cameraOn: true, isSpeaking: false },
]

export function ParticipantsPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border px-3">
        <span className="text-[12px] font-medium text-muted-foreground">Participants</span>
        <div className="flex items-center gap-2">
          <span className="text-[12px] tabular-nums text-muted">{PARTICIPANTS.length}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <IconUserPlus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Invite participant</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-2">
        {PARTICIPANTS.map(participant => (
          <ParticipantVideo key={participant.name} {...participant} />
        ))}
      </div>

      <CallControls />
    </div>
  )
}
