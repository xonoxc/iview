"use client"

import {
  IconBrandGolang,
  IconBrandJavascript,
  IconBrandPython,
  IconBrandRust,
  IconBrandTypescript,
  IconDots,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const LANGUAGES = [
  { value: "go", label: "Go", icon: IconBrandGolang },
  { value: "typescript", label: "TypeScript", icon: IconBrandTypescript },
  { value: "javascript", label: "JavaScript", icon: IconBrandJavascript },
  { value: "python", label: "Python", icon: IconBrandPython },
  { value: "rust", label: "Rust", icon: IconBrandRust },
]

export function EditorToolbar() {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-2">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2 py-1 text-[12.5px] font-medium text-foreground">
          <IconBrandGolang className="size-3.5 text-accent" />
          <span>main.go</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Select defaultValue="go">
          <SelectTrigger size="sm" className="gap-1.5 border-border bg-surface-2">
            <IconBrandGolang className="size-3.5 text-accent" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {LANGUAGES.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                <span className="flex items-center gap-1.5">
                  <lang.icon className="size-4 text-muted-foreground" />
                  {lang.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="primary" size="sm" className="gap-1.5">
              <IconPlayerPlayFilled className="size-3" />
              Run
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Run main.go</TooltipContent>
        </Tooltip>

        <Tooltip>
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <IconDots className="size-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Editor options</TooltipContent>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem>Find in file</DropdownMenuItem>
              <DropdownMenuItem>Format document</DropdownMenuItem>
              <DropdownMenuItem>Toggle word wrap</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Change language mode</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Tooltip>
      </div>
    </div>
  )
}
