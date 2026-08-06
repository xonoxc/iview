"use client"

import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"
import { EditorToolbar } from "@/components/room/editor/editor-toolbar"
import { CodeEditor } from "@/components/room/editor/code-editor"
import { ParticipantsPanel } from "@/components/room/participants/participants-panel"
import { TerminalPanel } from "@/components/room/terminal/terminal-panel"

function ResizeSeparator({
   vertical = false,
   className,
}: {
   vertical?: boolean
   className?: string
}) {
   return (
      <Separator
         className={cn(
            "group relative flex shrink-0 items-center justify-center bg-transparent",
            vertical ? "h-[5px] cursor-row-resize" : "w-[5px] cursor-col-resize",
            className
         )}
      >
         <span
            className={cn(
               "pointer-events-none absolute bg-border transition-colors group-hover:bg-border-strong group-active:bg-accent/70",
               vertical
                  ? "left-2 right-2 top-1/2 h-px -translate-y-1/2"
                  : "left-1/2 top-2 bottom-2 w-px -translate-x-1/2"
            )}
         />
      </Separator>
   )
}

export function Workspace() {
   return (
      <div className="flex min-h-0 flex-1 flex-col bg-background">
         <Group orientation="vertical" className="flex-1">
            <Panel defaultSize="74" minSize="45">
               <Group orientation="horizontal" className="flex h-full min-h-0">
                  <Panel defaultSize="75" minSize="48">
                     <div className="flex h-full min-h-0 flex-col bg-surface">
                        <EditorToolbar />
                        <CodeEditor />
                     </div>
                  </Panel>
                  <ResizeSeparator />
                  <Panel defaultSize="25" minSize="16">
                     <ParticipantsPanel />
                  </Panel>
               </Group>
            </Panel>

            <ResizeSeparator vertical />

            <Panel defaultSize="26" minSize="12" maxSize="60">
               <TerminalPanel />
            </Panel>
         </Group>
      </div>
   )
}
