"use client"

import {
  IconCircleFilled,
  IconMicrophone,
  IconMicrophoneOff,
  IconUser,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type ParticipantVideoProps = {
  name: string
  initials: string
  micOn?: boolean
  cameraOn?: boolean
  isSpeaking?: boolean
}

export function ParticipantVideo({
  name,
  initials,
  micOn = true,
  cameraOn = true,
  isSpeaking = false,
}: ParticipantVideoProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 overflow-hidden rounded-md border bg-surface-2",
        isSpeaking ? "border-live/50 ring-1 ring-live/40" : "border-border"
      )}
    >
      <div className="flex flex-1 items-center justify-center">
        {cameraOn ? (
          <IconUser className="size-7 text-muted/70" />
        ) : (
          <Avatar className="size-9 bg-surface-3">
            <AvatarFallback className="text-[12px] text-muted-foreground">{initials}</AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/45 px-2 py-1">
        <span className="flex min-w-0 items-center gap-1.5">
          {isSpeaking && <IconCircleFilled className="size-1.5 shrink-0 fill-live text-live" />}
          <span className="truncate text-[11px] font-medium text-white/90">{name}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          {micOn ? (
            <IconMicrophone className="size-3 text-white/70" />
          ) : (
            <IconMicrophoneOff className="size-3 text-danger" />
          )}
          {cameraOn ? (
            <IconVideo className="size-3 text-white/70" />
          ) : (
            <IconVideoOff className="size-3 text-danger" />
          )}
        </span>
      </div>
    </div>
  )
}
