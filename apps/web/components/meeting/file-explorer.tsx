import { useMemo, useRef, useState } from "react";
import {
  IconChevronDown,
  IconChevronRight,
  IconCopy,
  IconEdit,
  IconFile,
  IconFilePlus,
  IconFileTypeTs,
  IconFolder,
  IconFolderOpen,
  IconFolderPlus,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { fileTree } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type ExplorerNode = { id: string; name: string };
export type ExplorerFolder = { id: string; name: string; files: ExplorerNode[] };

let uid = 0;
const nextId = () => `n${++uid}`;

function initialTree(): ExplorerFolder[] {
  return fileTree.map((g) => ({
    id: nextId(),
    name: g.name,
    files: g.files.map((f) => ({ id: nextId(), name: f })),
  }));
}

function FileIcon({ name, className }: { name: string; className?: string }) {
  return name.endsWith(".ts") || name.endsWith(".tsx") ? (
    <IconFileTypeTs className={className} aria-hidden />
  ) : (
    <IconFile className={className} aria-hidden />
  );
}

export function FileExplorer({
  activeName,
  onOpen,
  knownNames,
  onClose,
}: {
  activeName: string;
  onOpen: (name: string) => void;
  knownNames: string[];
  onClose?: () => void;
}) {
  const [tree, setTree] = useState<ExplorerFolder[]>(initialTree);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [creating, setCreating] = useState<{ folderId: string; kind: "file" } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropFolder, setDropFolder] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tree;
    return tree
      .map((f) => ({ ...f, files: f.files.filter((n) => n.name.toLowerCase().includes(q)) }))
      .filter((f) => f.files.length > 0 || f.name.toLowerCase().includes(q));
  }, [tree, query]);

  function renameNode(id: string, name: string) {
    const value = name.trim();
    setRenaming(null);
    if (!value) return;
    setTree((t) =>
      t.map((f) =>
        f.id === id
          ? { ...f, name: value }
          : { ...f, files: f.files.map((n) => (n.id === id ? { ...n, name: value } : n)) },
      ),
    );
  }

  function deleteNode(id: string) {
    setTree((t) =>
      t
        .filter((f) => f.id !== id)
        .map((f) => ({ ...f, files: f.files.filter((n) => n.id !== id) })),
    );
  }

  function duplicateNode(folderId: string, node: ExplorerNode) {
    const dot = node.name.lastIndexOf(".");
    const copy =
      dot > 0 ? `${node.name.slice(0, dot)}.copy${node.name.slice(dot)}` : `${node.name} copy`;
    setTree((t) =>
      t.map((f) =>
        f.id === folderId ? { ...f, files: [...f.files, { id: nextId(), name: copy }] } : f,
      ),
    );
  }

  function addFolder() {
    const id = nextId();
    setTree((t) => [...t, { id, name: "new-folder", files: [] }]);
    setRenaming(id);
    setDraft("new-folder");
  }

  function commitNewFile(folderId: string, name: string) {
    setCreating(null);
    const value = name.trim();
    if (!value) return;
    setTree((t) =>
      t.map((f) =>
        f.id === folderId ? { ...f, files: [...f.files, { id: nextId(), name: value }] } : f,
      ),
    );
  }

  function moveFile(nodeId: string, targetFolderId: string) {
    setTree((t) => {
      let moved: ExplorerNode | undefined;
      const stripped = t.map((f) => {
        const hit = f.files.find((n) => n.id === nodeId);
        if (!hit) return f;
        moved = hit;
        return { ...f, files: f.files.filter((n) => n.id !== nodeId) };
      });
      if (!moved) return t;
      return stripped.map((f) =>
        f.id === targetFolderId ? { ...f, files: [...f.files, moved!] } : f,
      );
    });
  }

  const fileCount = tree.reduce((n, f) => n + f.files.length, 0);

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-9 shrink-0 items-center justify-between gap-1 border-b border-border pl-3 pr-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Explorer
        </span>
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  const target = tree[0];
                  if (!target) return;
                  setCollapsed((c) => ({ ...c, [target.id]: false }));
                  setCreating({ folderId: target.id, kind: "file" });
                  setDraft("");
                }}
                className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <IconFilePlus className="h-3.5 w-3.5" />
                <span className="sr-only">New file</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">New file</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={addFolder}
                className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <IconFolderPlus className="h-3.5 w-3.5" />
                <span className="sr-only">New folder</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">New folder</TooltipContent>
          </Tooltip>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            >
              <IconX className="h-3.5 w-3.5" />
              <span className="sr-only">Close explorer</span>
            </button>
          )}
        </div>
      </div>

      <div className="shrink-0 border-b border-border p-2">
        <div className="relative">
          <IconSearch
            className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files"
            className="h-7 bg-background pl-7 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="py-1.5">
          {filtered.map((folder) => {
            const isCollapsed = collapsed[folder.id] && !query;
            const isDropTarget = dropFolder === folder.id;
            return (
              <div key={folder.id} className="mb-0.5">
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <div
                      onDragOver={(e) => {
                        if (!dragId) return;
                        e.preventDefault();
                        setDropFolder(folder.id);
                      }}
                      onDragLeave={() => setDropFolder((f) => (f === folder.id ? null : f))}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (dragId) moveFile(dragId, folder.id);
                        setDragId(null);
                        setDropFolder(null);
                      }}
                      className={cn(
                        "mx-1 flex items-center gap-1 rounded-md px-1.5 py-1 text-xs transition-colors",
                        isDropTarget
                          ? "bg-primary/15 ring-1 ring-primary/40"
                          : "hover:bg-accent/60",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setCollapsed((c) => ({ ...c, [folder.id]: !c[folder.id] }))}
                        className="flex min-w-0 flex-1 items-center gap-1 text-left text-muted-foreground hover:text-foreground"
                      >
                        {isCollapsed ? (
                          <IconChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        ) : (
                          <IconChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        )}
                        {isCollapsed ? (
                          <IconFolder className="h-3.5 w-3.5 shrink-0 text-warning/80" aria-hidden />
                        ) : (
                          <IconFolderOpen
                            className="h-3.5 w-3.5 shrink-0 text-warning/80"
                            aria-hidden
                          />
                        )}
                        {renaming === folder.id ? (
                          <input
                            ref={inputRef}
                            autoFocus
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onBlur={() => renameNode(folder.id, draft)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") renameNode(folder.id, draft);
                              if (e.key === "Escape") setRenaming(null);
                            }}
                            className="min-w-0 flex-1 rounded-sm border border-primary/50 bg-background px-1 text-xs outline-none"
                          />
                        ) : (
                          <span className="truncate">{folder.name}</span>
                        )}
                      </button>
                      <span className="shrink-0 text-[10px] text-muted-foreground/60">
                        {folder.files.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCollapsed((c) => ({ ...c, [folder.id]: false }));
                          setCreating({ folderId: folder.id, kind: "file" });
                          setDraft("");
                        }}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground opacity-0 transition hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 md:opacity-0 [div:hover>&]:opacity-100"
                      >
                        <IconFilePlus className="h-3.5 w-3.5" />
                        <span className="sr-only">New file in {folder.name}</span>
                      </button>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-44">
                    <ContextMenuItem
                      onSelect={() => {
                        setCreating({ folderId: folder.id, kind: "file" });
                        setDraft("");
                      }}
                    >
                      <IconFilePlus className="h-4 w-4" /> New file
                    </ContextMenuItem>
                    <ContextMenuItem
                      onSelect={() => {
                        setRenaming(folder.id);
                        setDraft(folder.name);
                      }}
                    >
                      <IconEdit className="h-4 w-4" /> Rename
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem className="text-destructive focus:text-destructive" onSelect={() => deleteNode(folder.id)}>
                      <IconTrash className="h-4 w-4" /> Delete folder
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>

                {!isCollapsed && (
                  <div className="mt-0.5">
                    {folder.files.map((node) => {
                      const known = knownNames.includes(node.name);
                      const isActive = node.name === activeName;
                      if (renaming === node.id) {
                        return (
                          <div key={node.id} className="mx-1 py-0.5 pl-7 pr-1.5">
                            <input
                              autoFocus
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              onBlur={() => renameNode(node.id, draft)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") renameNode(node.id, draft);
                                if (e.key === "Escape") setRenaming(null);
                              }}
                              className="w-full rounded-sm border border-primary/50 bg-background px-1 py-0.5 text-xs outline-none"
                            />
                          </div>
                        );
                      }
                      return (
                        <ContextMenu key={node.id}>
                          <ContextMenuTrigger asChild>
                            <button
                              type="button"
                              draggable
                              onDragStart={() => setDragId(node.id)}
                              onDragEnd={() => {
                                setDragId(null);
                                setDropFolder(null);
                              }}
                              onClick={() => known && onOpen(node.name)}
                              className={cn(
                                "mx-1 flex w-[calc(100%-0.5rem)] items-center gap-1.5 rounded-md py-1 pl-7 pr-2 text-left text-xs transition-colors",
                                isActive
                                  ? "bg-accent text-foreground"
                                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                                !known && "opacity-60",
                                dragId === node.id && "opacity-40",
                              )}
                            >
                              <FileIcon
                                name={node.name}
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0",
                                  isActive ? "text-primary" : "",
                                )}
                              />
                              <span className="truncate">{node.name}</span>
                            </button>
                          </ContextMenuTrigger>
                          <ContextMenuContent className="w-44">
                            <ContextMenuItem
                              disabled={!known}
                              onSelect={() => onOpen(node.name)}
                            >
                              <IconFile className="h-4 w-4" /> Open
                            </ContextMenuItem>
                            <ContextMenuItem
                              onSelect={() => {
                                setRenaming(node.id);
                                setDraft(node.name);
                              }}
                            >
                              <IconEdit className="h-4 w-4" /> Rename
                            </ContextMenuItem>
                            <ContextMenuItem onSelect={() => duplicateNode(folder.id, node)}>
                              <IconCopy className="h-4 w-4" /> Duplicate
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => deleteNode(node.id)}
                            >
                              <IconTrash className="h-4 w-4" /> Delete
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      );
                    })}

                    {creating?.folderId === folder.id && (
                      <div className="mx-1 py-0.5 pl-7 pr-1.5">
                        <input
                          autoFocus
                          value={draft}
                          placeholder="file-name.ts"
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={() => commitNewFile(folder.id, draft)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitNewFile(folder.id, draft);
                            if (e.key === "Escape") setCreating(null);
                          }}
                          className="w-full rounded-sm border border-primary/50 bg-background px-1 py-0.5 text-xs outline-none placeholder:text-muted-foreground/60"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              No files match “{query}”.
            </p>
          )}
        </div>
      </ScrollArea>

      <div className="flex h-7 shrink-0 items-center justify-between border-t border-border px-3 text-[10px] text-muted-foreground">
        <span>
          {tree.length} folders · {fileCount} files
        </span>
        <span className="hidden lg:inline">Drag to move</span>
      </div>
    </div>
  );
}
