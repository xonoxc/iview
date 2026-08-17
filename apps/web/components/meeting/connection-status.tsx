import { IconLoader2, IconPlugConnectedX, IconAlertTriangle } from "@tabler/icons-react";
import type { ConnectionState } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Meta = {
  label: string;
  dot: string;
  chip: string;
  text: string;
  icon?: typeof IconLoader2;
  spin?: boolean;
  pulse?: boolean;
};

const map: Record<ConnectionState, Meta> = {
  connecting: {
    label: "Connecting",
    dot: "bg-warning",
    chip: "border-warning/25 bg-warning/10",
    text: "text-warning",
    icon: IconLoader2,
    spin: true,
    pulse: true,
  },
  connected: {
    label: "Connected",
    dot: "bg-success",
    chip: "border-border bg-secondary/60",
    text: "text-muted-foreground",
  },
  reconnecting: {
    label: "Reconnecting",
    dot: "bg-warning",
    chip: "border-warning/25 bg-warning/10",
    text: "text-warning",
    icon: IconAlertTriangle,
    pulse: true,
  },
  disconnected: {
    label: "Disconnected",
    dot: "bg-destructive",
    chip: "border-destructive/30 bg-destructive/10",
    text: "text-destructive",
    icon: IconPlugConnectedX,
  },
};

export function ConnectionStatus({
  state,
  className,
}: {
  state: ConnectionState;
  className?: string;
}) {
  const s = map[state];
  const Icon = s.icon;
  return (
    <div
      className={cn(
        "flex h-6 items-center gap-1.5 rounded-full border px-2 text-[11px] font-medium leading-none",
        s.chip,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {s.pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              s.dot,
            )}
          />
        )}
        <span className={cn("inline-flex h-1.5 w-1.5 rounded-full", s.dot)} />
      </span>
      <span className={s.text}>{s.label}</span>
      {Icon && (
        <Icon className={cn("h-3 w-3 shrink-0", s.text, s.spin && "animate-spin")} aria-hidden />
      )}
    </div>
  );
}
