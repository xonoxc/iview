import { Fragment } from "react"
import { IconCpu } from "@tabler/icons-react"

type TokenKind = "comment" | "string" | "keyword" | "number" | "plain"

type Token = { text: string; kind: TokenKind }

const KEYWORDS =
   "package import func return if else for range var const type struct interface map chan go defer select switch case break continue fallthrough default"

const TOKEN_RE = new RegExp(
   [
      "(\\/\\/[^\\n]*)",
      '("(?:[^"\\\\\\n]|\\\\.)*"|`[^`]*`)',
      "\\b(?:" + KEYWORDS.split(" ").join("|") + ")\\b",
      "\\b\\d+(?:\\.\\d+)?\\b",
   ].join("|"),
   "g"
)

function tokenizeLine(line: string): Token[] {
   const tokens: Token[] = []
   let lastIndex = 0
   let match: RegExpExecArray | null

   TOKEN_RE.lastIndex = 0
   while ((match = TOKEN_RE.exec(line)) !== null) {
      if (match.index > lastIndex) {
         tokens.push({ text: line.slice(lastIndex, match.index), kind: "plain" })
      }
      if (match[1]) tokens.push({ text: match[1], kind: "comment" })
      else if (match[2]) tokens.push({ text: match[2], kind: "string" })
      else if (match[3]) tokens.push({ text: match[3], kind: "keyword" })
      else if (match[4]) tokens.push({ text: match[4], kind: "number" })
      lastIndex = match.index + match[0].length
   }
   if (lastIndex < line.length) {
      tokens.push({ text: line.slice(lastIndex), kind: "plain" })
   }
   return tokens
}

const TOKEN_CLASS: Record<TokenKind, string> = {
   comment: "text-muted italic",
   string: "text-live/90",
   keyword: "text-accent/90",
   number: "text-warning/80",
   plain: "text-foreground/90",
}

const SOURCE = [
   "package main",
   "",
   "import (",
   '\t"fmt"',
   '\t"net/http"',
   ")",
   "",
   "func main() {",
   '\thttp.HandleFunc("/room", handleRoom)',
   "",
   '\tfmt.Println("Hello from iview")',
   '\thttp.ListenAndServe(":8080", nil)',
   "}",
   "",
   "func handleRoom(w http.ResponseWriter, r *http.Request) {",
   '\troomID := r.URL.Query().Get("id")',
   '\tfmt.Fprintf(w, "live room: %s", roomID)',
   "}",
]

export function CodeEditor() {
   return (
      <div className="relative flex h-full min-h-0 flex-1 bg-surface">
         <div className="flex-1 overflow-auto py-3 pl-4 pr-6 font-mono text-[13px] leading-6">
            {SOURCE.map((line, lineIndex) => (
               <div key={lineIndex} className="flex whitespace-pre">
                  <span className="w-8 shrink-0 select-none pr-3 text-right text-muted/60">
                     {lineIndex + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                     {line.length === 0 ? (
                        "\u00A0"
                     ) : (
                        <>
                           {tokenizeLine(line).map((token, tokenIndex) => (
                              <Fragment key={tokenIndex}>
                                 <span className={TOKEN_CLASS[token.kind]}>{token.text}</span>
                              </Fragment>
                           ))}
                        </>
                     )}
                  </span>
               </div>
            ))}
         </div>

         <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-1.5 rounded-md border border-border bg-surface-2/80 px-1.5 py-0.5 text-[11px] text-muted">
            <IconCpu className="size-3.5" />
            Monaco placeholder
         </div>
      </div>
   )
}
