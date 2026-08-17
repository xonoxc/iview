import {
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
  IconScreenShare,
  IconScreenShareOff,
  IconUsers,
  IconMessage2,
  IconPhoneOff,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ToggleProps = {
  label: string;
  active: boolean;
  danger?: boolean;
  onClick: () => void;
  on: React.ReactNode;
  off: React.ReactNode;
};

function ControlToggle({ label, active, danger, onClick, on, off }: ToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-pressed={active}
          aria-label={label}
          onClick={onClick}
          className={cn(
            "h-8 w-8 rounded-md border border-transparent",
            active
              ? "bg-secondary text-foreground hover:bg-accent"
              : danger
                ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          {active ? on : off}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

export function MeetingControls({
  micOn,
  cameraOn,
  sharing,
  sidebarOpen,
  onToggleMic,
  onToggleCamera,
  onToggleShare,
  onOpenPanel,
  onLeave,
}: {
  micOn: boolean;
  cameraOn: boolean;
  sharing: boolean;
  sidebarOpen: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleShare: () => void;
  onOpenPanel: (panel: "participants" | "chat") => void;
  onLeave: () => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card/95 p-1.5 backdrop-blur">
      <ControlToggle
        label={micOn ? "Mute microphone" : "Unmute microphone"}
        active={micOn}
        danger
        onClick={onToggleMic}
        on={<IconMicrophone className="h-4 w-4" />}
        off={<IconMicrophoneOff className="h-4 w-4" />}
      />
      <ControlToggle
        label={cameraOn ? "Turn camera off" : "Turn camera on"}
        active={cameraOn}
        danger
        onClick={onToggleCamera}
        on={<IconVideo className="h-4 w-4" />}
        off={<IconVideoOff className="h-4 w-4" />}
      />
      <ControlToggle
        label={sharing ? "Stop sharing screen" : "Share screen"}
        active={sharing}
        onClick={onToggleShare}
        on={<IconScreenShare className="h-4 w-4" />}
        off={<IconScreenShareOff className="h-4 w-4" />}
      />

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ControlToggle
        label="Participants"
        active={sidebarOpen}
        onClick={() => onOpenPanel("participants")}
        on={<IconUsers className="h-4 w-4" />}
        off={<IconUsers className="h-4 w-4" />}
      />
      <ControlToggle
        label="Chat"
        active={sidebarOpen}
        onClick={() => onOpenPanel("chat")}
        on={<IconMessage2 className="h-4 w-4" />}
        off={<IconMessage2 className="h-4 w-4" />}
      />

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onLeave}
        className="h-8 gap-1.5 px-3 text-sm"
      >
        <IconPhoneOff className="h-4 w-4" />
        Leave
      </Button>
    </div>
  );
}
