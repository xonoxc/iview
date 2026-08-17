import { useMemo, useState } from "react";
import {
  IconBrandTypescript,
  IconFile,
  IconFileTypeTs,
  IconGitBranch,
  IconLayoutSidebar,
  IconLayoutSidebarLeftCollapse,
  IconTerminal2,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { FileExplorer } from "./file-explorer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { codeFiles, cursors, type CodeFile, type Token } from "@/lib/mock-data";
import { TerminalDrawer } from "./terminal-drawer";
import { cn } from "@/lib/utils";

const TOKEN_CLASS: Record<string, string> = {
  kw: "text-[var(--code-keyword)]",
  str: "text-[var(--code-string)]",
  fn: "text-[var(--code-fn)]",
  type: "text-[var(--code-type)]",
  num: "text-[var(--code-number)]",
  com: "text-[var(--code-comment)] italic",
  punct: "text-[var(--code-punct)]",
};

function lineText(line: Token[]) {
  return line.map((t) => t.t).join("");
}

function EditorSurface({ file }: { file: CodeFile }) {
  const fileCursors = cursors.filter((c) => c.fileId === file.id);

  return (
    <ScrollArea className="h-full">
      <div className="relative min-w-full py-2 font-mono text-[12.5px] leading-[1.6]">
        {file.lines.map((line, i) => {
          const n = i + 1;
          const cursor = fileCursors.find((c) => c.line === n);
          return (
            <div
              key={n}
              className={cn("group relative flex items-start", cursor && "bg-accent/40")}
            >
              <span className="sticky left-0 w-12 shrink-0 select-none bg-background pr-3 text-right text-[11px] text-muted-foreground/70">
                {n}
              </span>
              <pre className="relative whitespace-pre pr-8">
                {line.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  line.map((t, ti) => (
                    <span key={ti} className={t.k ? TOKEN_CLASS[t.k] : "text-foreground/90"}>
                      {t.t}
                    </span>
                  ))
                )}
                {cursor?.selection && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 rounded-[2px] opacity-25"
                    style={{
                      left: `${cursor.selection.from}ch`,
                      width: `${Math.max(
                        1,
                        Math.min(cursor.selection.to, lineText(line).length) -
                          cursor.selection.from,
                      )}ch`,
                      backgroundColor: `var(${cursor.colorVar})`,
                    }}
                  />
                )}
                {cursor && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0"
                    style={{ left: `${cursor.column}ch` }}
                  >
                    <span
                      className="absolute inset-y-0 w-[2px]"
                      style={{ backgroundColor: `var(${cursor.colorVar})` }}
                    />
                    <span
                      className="absolute -top-3 left-0 z-10 whitespace-nowrap rounded-sm px-1 text-[10px] font-medium leading-[14px] text-background opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ backgroundColor: `var(${cursor.colorVar})` }}
                    >
                      {cursor.name.split(" ")[0]}
                    </span>
                  </span>
                )}
              </pre>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export function CodeWorkspace({
  compact,
  terminalOpen: terminalOpenProp,
  onTerminalOpenChange,
}: {
  compact?: boolean;
  terminalOpen?: boolean;
  onTerminalOpenChange?: (open: boolean) => void;
}) {
  const [openIds, setOpenIds] = useState<string[]>(["f1", "f2"]);
  const [activeId, setActiveId] = useState("f1");
  const [explorerOpen, setExplorerOpen] = useState(!compact);
  const [terminalOpenLocal, setTerminalOpenLocal] = useState(false);
  const terminalOpen = terminalOpenProp ?? terminalOpenLocal;
  const setTerminalOpen = (next: boolean) => {
    setTerminalOpenLocal(next);
    onTerminalOpenChange?.(next);
  };
  const [mobileExplorer, setMobileExplorer] = useState(false);
  const knownNames = codeFiles.map((f) => f.name);

  const active = useMemo(
    () => codeFiles.find((f) => f.id === activeId) ?? codeFiles[0]!,
    [activeId],
  );
  const openFiles = openIds
    .map((id) => codeFiles.find((f) => f.id === id))
    .filter(Boolean) as CodeFile[];
  const fileCursors = cursors.filter((c) => c.fileId === active.id);

  function openByName(name: string) {
    const f = codeFiles.find((c) => c.name === name);
    if (!f) return;
    setOpenIds((ids) => (ids.includes(f.id) ? ids : [...ids, f.id]));
    setActiveId(f.id);
  }

  function closeTab(id: string) {
    setOpenIds((ids) => {
      const next = ids.filter((i) => i !== id);
      if (id === activeId && next.length) setActiveId(next[next.length - 1]!);
      return next;
    });
  }

  return (
    <div className="flex h-full min-h-0 border-y border-border bg-background">
      {explorerOpen && (
        <div className="hidden w-56 shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col xl:w-60">
          <FileExplorer activeName={active.name} onOpen={openByName} knownNames={knownNames} />
        </div>
      )}

      <Sheet open={mobileExplorer} onOpenChange={setMobileExplorer}>
        <SheetContent side="left" className="w-72 border-border bg-sidebar p-0">
          <SheetTitle className="sr-only">File explorer</SheetTitle>
          <FileExplorer
            activeName={active.name}
            knownNames={knownNames}
            onOpen={(n) => {
              openByName(n);
              setMobileExplorer(false);
            }}
            onClose={() => setMobileExplorer(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 shrink-0 items-stretch border-b border-border bg-sidebar">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  if (window.matchMedia("(min-width: 1024px)").matches) {
                    setExplorerOpen((v) => !v);
                  } else {
                    setMobileExplorer(true);
                  }
                }}
                className="flex w-9 shrink-0 items-center justify-center border-r border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {explorerOpen ? (
                  <IconLayoutSidebarLeftCollapse className="h-4 w-4" />
                ) : (
                  <IconLayoutSidebar className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle file explorer</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {explorerOpen ? "Hide explorer" : "Show explorer"}
            </TooltipContent>
          </Tooltip>

          <ScrollArea className="min-w-0 flex-1">
            <div className="flex h-9 items-stretch">
              {openFiles.map((f) => {
                const isActive = f.id === active.id;
                return (
                  <div
                    key={f.id}
                    className={cn(
                      "group flex shrink-0 items-center gap-2 border-r border-border pl-3 pr-2 text-xs transition-colors",
                      isActive
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(f.id)}
                      className="flex items-center gap-1.5 py-2"
                    >
                      {f.name.endsWith(".ts") ? (
                        <IconFileTypeTs className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        <IconFile className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {f.name}
                      {f.dirty && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-warning"
                          aria-label="Unsaved"
                        />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => closeTab(f.id)}
                      className="rounded-sm p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100"
                    >
                      <IconX className="h-3 w-3" />
                      <span className="sr-only">Close {f.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="flex shrink-0 items-center gap-1 border-l border-border px-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setTerminalOpen(!terminalOpen)}
                  aria-pressed={terminalOpen}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-sm transition-colors hover:bg-accent hover:text-foreground",
                    terminalOpen ? "bg-accent text-foreground" : "text-muted-foreground",
                  )}
                >
                  <IconTerminal2 className="h-4 w-4" />
                  <span className="sr-only">Toggle terminal</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {terminalOpen ? "Hide terminal" : "Show terminal"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <EditorSurface file={active} />
        </div>

        {terminalOpen && <TerminalDrawer onClose={() => setTerminalOpen(false)} />}

        <div className="flex h-7 shrink-0 items-center justify-between gap-3 border-t border-border bg-sidebar px-3 text-[11px] text-muted-foreground">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex shrink-0 items-center gap-1">
              <IconGitBranch className="h-3.5 w-3.5" aria-hidden />
              fix/nested-import-guard
            </span>
            <span className="hidden truncate sm:inline">{active.path}</span>
            <button
              type="button"
              onClick={() => setTerminalOpen(!terminalOpen)}
              aria-pressed={terminalOpen}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-0.5 transition-colors hover:bg-accent hover:text-foreground",
                terminalOpen && "bg-accent text-foreground",
              )}
            >
              <IconTerminal2 className="h-3.5 w-3.5" aria-hidden />
              Terminal
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-1">
              <IconUsers className="h-3.5 w-3.5" aria-hidden />
              {fileCursors.length} editing
            </span>
            <div className="flex -space-x-1">
              {fileCursors.map((c) => (
                <span
                  key={c.participantId}
                  title={`${c.name} · line ${c.line}`}
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold text-background ring-1 ring-sidebar"
                  style={{ backgroundColor: `var(${c.colorVar})` }}
                >
                  {c.initials}
                </span>
              ))}
            </div>
            <span className="hidden sm:inline">Ln 13, Col 24</span>
            <span className="hidden items-center gap-1 sm:flex">
              <IconBrandTypescript className="h-3.5 w-3.5" aria-hidden />
              {active.language}
            </span>
            <span className="hidden md:inline">UTF-8</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Synced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
