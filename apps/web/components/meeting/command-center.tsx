import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowRight,
  IconCopy,
  IconLayoutColumns,
  IconLayoutGrid,
  IconLogout,
  IconMessage,
  IconMicrophone,
  IconMicrophoneOff,
  IconScreenShare,
  IconScreenShareOff,
  IconTerminal2,
  IconUsers,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import type { WorkspaceMode } from "@/components/meeting/workspace-mode-switch";

export type CommandCenterActions = {
  micOn: boolean;
  cameraOn: boolean;
  sharing: boolean;
  terminalOpen: boolean;
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleShare: () => void;
  toggleTerminal: () => void;
  setMode: (mode: WorkspaceMode) => void;
  openPanel: (panel: "participants" | "chat") => void;
  copyInvite: () => void;
  leave: () => void;
};

export function CommandCenter({
  open,
  onOpenChange,
  actions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: CommandCenterActions;
}) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "k" || e.key === "K" || e.code === "KeyK")) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const run = (fn: () => void) => () => {
    fn();
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No matching command.</CommandEmpty>

        <CommandGroup heading="Devices">
          <CommandItem onSelect={run(actions.toggleMic)}>
            {actions.micOn ? <IconMicrophoneOff /> : <IconMicrophone />}
            <span>{actions.micOn ? "Mute microphone" : "Unmute microphone"}</span>
            <CommandShortcut>⌥ M</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={run(actions.toggleCamera)}>
            {actions.cameraOn ? <IconVideoOff /> : <IconVideo />}
            <span>{actions.cameraOn ? "Turn camera off" : "Turn camera on"}</span>
            <CommandShortcut>⌥ V</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={run(actions.toggleShare)}>
            {actions.sharing ? <IconScreenShareOff /> : <IconScreenShare />}
            <span>{actions.sharing ? "Stop screen share" : "Share screen"}</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Workspace">
          <CommandItem onSelect={run(() => actions.setMode("video"))}>
            <IconLayoutGrid />
            <span>Switch to video mode</span>
          </CommandItem>
          <CommandItem onSelect={run(() => actions.setMode("code"))}>
            <IconTerminal2 />
            <span>Switch to code mode</span>
          </CommandItem>
          <CommandItem onSelect={run(() => actions.setMode("split"))}>
            <IconLayoutColumns />
            <span>Switch to split mode</span>
          </CommandItem>
          <CommandItem onSelect={run(actions.toggleTerminal)}>
            <IconTerminal2 />
            <span>{actions.terminalOpen ? "Hide terminal" : "Show terminal"}</span>
            <CommandShortcut>⌥ T</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Panels">
          <CommandItem onSelect={run(() => actions.openPanel("participants"))}>
            <IconUsers />
            <span>Open participants</span>
          </CommandItem>
          <CommandItem onSelect={run(() => actions.openPanel("chat"))}>
            <IconMessage />
            <span>Open chat</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Session">
          <CommandItem onSelect={run(actions.copyInvite)}>
            <IconCopy />
            <span>Copy invite link</span>
          </CommandItem>
          <CommandItem onSelect={run(() => router.push("/"))}>
            <IconArrowRight />
            <span>Go to home</span>
          </CommandItem>
          <CommandItem onSelect={run(actions.leave)} className="text-destructive">
            <IconLogout />
            <span>Leave session</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
