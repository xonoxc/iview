import { IconMicrophoneOff, IconVideoOff } from "@tabler/icons-react";
import type { Participant } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function VideoRail({ participants }: { participants: Participant[] }) {
  if (participants.length === 0) return null;

  return (
    <div className="flex shrink-0 items-center gap-2.5 overflow-x-auto border-b border-border bg-sidebar px-3 py-2.5">
      {participants.map((p) => (
        <div
          key={p.id}
          className={cn(
            "relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-card",
            p.speaking
              ? "border-primary/70 shadow-[0_0_0_1px_var(--color-primary)]"
              : "border-border",
          )}
        >
          {p.cameraOn ? (
            <div className="absolute inset-0 bg-accent" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-[11px] font-medium text-secondary-foreground">
              {p.initials}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-background/90 via-background/60 to-transparent px-2 py-1.5">
            <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground/90">
              {p.isYou ? "You" : p.name}
            </span>
            {!p.micOn && (
              <IconMicrophoneOff
                className="h-3 w-3 shrink-0 text-muted-foreground"
                aria-label={`${p.name} is muted`}
              />
            )}
            {!p.cameraOn && (
              <IconVideoOff
                className="h-3 w-3 shrink-0 text-muted-foreground"
                aria-label={`${p.name} camera off`}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
