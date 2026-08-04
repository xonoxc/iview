"use client"

import { IconMicrophone, IconPhoneOff, IconScreenShare, IconUserPlus, IconVideo } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function CallControls() {
  return (
    <div className="flex h-9 shrink-0 items-center justify-center gap-1 border-t border-border bg-surface px-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <IconMicrophone className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Mute microphone</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <IconVideo className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Turn off camera</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <IconScreenShare className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Share screen</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <IconUserPlus className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Invite</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-1 h-4" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-danger hover:bg-danger/15 hover:text-danger"
          >
            <IconPhoneOff className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Leave call</TooltipContent>
      </Tooltip>
    </div>
  )
}
