export type ConnectionState = "connecting" | "connected" | "reconnecting" | "disconnected";

export type Participant = {
  id: string;
  name: string;
  initials: string;
  isYou?: boolean;
  micOn: boolean;
  cameraOn: boolean;
  speaking?: boolean;
  role?: string;
  presence: "active" | "idle";
  colorVar?: string;
  sharing?: boolean;
};

export type ChatBadge = "host" | "mod" | "guest" | "bot" | "vip";

export type ChatMessage = {
  id: string;
  author: string;
  initials: string;
  time: string;
  body: string;
  isYou?: boolean;
  colorVar?: string;
  badges?: ChatBadge[];
  mentionsYou?: boolean;
  replyTo?: string;
  highlighted?: boolean;
  reactions?: { emoji: string; count: number; mine?: boolean }[];
  kind?: "message" | "event";
  eventIcon?: "join" | "share" | "pin" | "leave";
};

export type Room = {
  id: string;
  name: string;
  createdLabel: string;
  expiresLabel: string;
  participants: number;
  expired?: boolean;
};

export const participants: Participant[] = [
  {
    id: "p1",
    name: "You",
    initials: "AK",
    isYou: true,
    micOn: true,
    cameraOn: true,
    presence: "active",
    role: "Host",
    colorVar: "--chat-5",
  },
  {
    id: "p2",
    name: "Mira Solberg",
    initials: "MS",
    micOn: true,
    cameraOn: true,
    speaking: true,
    presence: "active",
    role: "Engineer",
    colorVar: "--chat-6",
    sharing: true,
  },
  {
    id: "p3",
    name: "Dev Raghunathan",
    initials: "DR",
    micOn: false,
    cameraOn: false,
    presence: "active",
    role: "Design",
    colorVar: "--chat-4",
  },
  {
    id: "p4",
    name: "Tomas Lind",
    initials: "TL",
    micOn: true,
    cameraOn: false,
    presence: "idle",
    role: "PM",
    colorVar: "--chat-2",
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "m0",
    author: "Tomas Lind",
    initials: "TL",
    time: "13:58",
    body: "joined the room",
    kind: "event",
    eventIcon: "join",
    colorVar: "--chat-4",
  },
  {
    id: "m1",
    author: "Mira Solberg",
    initials: "MS",
    time: "14:02",
    body: "Pushed the branch with the parser fix — should be green in CI now.",
    colorVar: "--chat-2",
    badges: ["mod"],
    reactions: [
      { emoji: "🔥", count: 3 },
      { emoji: "🙌", count: 1 },
    ],
  },
  {
    id: "m2",
    author: "Dev Raghunathan",
    initials: "DR",
    time: "14:03",
    body: "Looking. The failing case was the nested import guard, right?",
    colorVar: "--chat-3",
    replyTo: "Mira Solberg",
  },
  {
    id: "m3",
    author: "You",
    initials: "AK",
    time: "14:04",
    body: "Yes. I'll share my screen and walk through the diff so we can decide before the release cut at 15:00.",
    isYou: true,
    colorVar: "--chat-1",
    badges: ["host"],
  },
  {
    id: "m4",
    author: "Relay",
    initials: "RL",
    time: "14:05",
    body: "You started sharing your screen",
    kind: "event",
    eventIcon: "share",
    colorVar: "--chat-6",
  },
  {
    id: "m5",
    author: "Tomas Lind",
    initials: "TL",
    time: "14:06",
    body: "@You can you scroll to the guard block? I think line 41 is the culprit.",
    colorVar: "--chat-4",
    mentionsYou: true,
    highlighted: true,
    badges: ["guest"],
  },
  {
    id: "m6",
    author: "Mira Solberg",
    initials: "MS",
    time: "14:07",
    body: "Good catch — patching it now.",
    colorVar: "--chat-2",
    badges: ["mod"],
    reactions: [{ emoji: "👀", count: 2, mine: true }],
  },
  {
    id: "m7",
    author: "CI Bot",
    initials: "CI",
    time: "14:08",
    body: "build #4192 passed in 1m 42s",
    colorVar: "--chat-5",
    badges: ["bot"],
  },
];

export const chatEmotes: { char: string; name: string }[] = [
  { char: "😂", name: "lol" },
  { char: "🔥", name: "fire" },
  { char: "🙌", name: "praise" },
  { char: "💜", name: "love" },
  { char: "😮", name: "wow" },
  { char: "👀", name: "eyes" },
  { char: "💀", name: "dead" },
  { char: "🧠", name: "big brain" },
  { char: "🚢", name: "ship it" },
  { char: "✅", name: "done" },
];

export type TerminalLine = {
  id: string;
  kind: "cmd" | "out" | "ok" | "warn" | "err" | "dim";
  text: string;
};

export const terminalLines: TerminalLine[] = [
  { id: "t1", kind: "cmd", text: "bun run test --filter parser" },
  { id: "t2", kind: "dim", text: "$ vitest run src/parser" },
  { id: "t3", kind: "out", text: " ✓ src/parser/guard.test.ts (12 tests) 214ms" },
  { id: "t4", kind: "out", text: " ✓ src/parser/tokens.test.ts (31 tests) 402ms" },
  { id: "t5", kind: "warn", text: " ! nested import guard: 1 slow test (>500ms)" },
  { id: "t6", kind: "ok", text: " Test Files  2 passed (2)" },
  { id: "t7", kind: "ok", text: "      Tests  43 passed (43)" },
  { id: "t8", kind: "dim", text: "   Duration  1.42s" },
  { id: "t9", kind: "cmd", text: "git status --short" },
  { id: "t10", kind: "out", text: " M src/parser/guard.ts" },
  { id: "t11", kind: "out", text: " M src/parser/index.ts" },
  { id: "t12", kind: "err", text: "warning: 2 files changed, commit before switching branches" },
];

export const recentRooms: Room[] = [
  {
    id: "kd7-92m-4xz",
    name: "Runtime working session",
    createdLabel: "Created 8 min ago",
    expiresLabel: "expires in 2h",
    participants: 4,
  },
  {
    id: "aa1-55p-9qb",
    name: "Design review — meeting shell and control bar density pass",
    createdLabel: "Created 46 min ago",
    expiresLabel: "expires in 1h 12m",
    participants: 2,
  },
  {
    id: "zz0-11c-7tt",
    name: "Incident 4192 triage",
    createdLabel: "Created 3h ago",
    expiresLabel: "expired",
    participants: 0,
    expired: true,
  },
];

export type Token = {
  t: string;
  k?: "kw" | "str" | "fn" | "type" | "num" | "com" | "punct";
};

export type CodeFile = {
  id: string;
  name: string;
  path: string;
  language: string;
  dirty?: boolean;
  lines: Token[][];
};

export type CursorPresence = {
  participantId: string;
  name: string;
  initials: string;
  fileId: string;
  line: number;
  column: number;
  colorVar: string;
  selection?: { line: number; from: number; to: number };
};

const kw = (t: string): Token => ({ t, k: "kw" });
const str = (t: string): Token => ({ t, k: "str" });
const fn = (t: string): Token => ({ t, k: "fn" });
const ty = (t: string): Token => ({ t, k: "type" });
const num = (t: string): Token => ({ t, k: "num" });
const com = (t: string): Token => ({ t, k: "com" });
const p = (t: string): Token => ({ t, k: "punct" });
const x = (t: string): Token => ({ t });

export const codeFiles: CodeFile[] = [
  {
    id: "f1",
    name: "parser.ts",
    path: "src/runtime/parser.ts",
    language: "TypeScript",
    dirty: true,
    lines: [
      [kw("import"), x(" "), p("{"), x(" "), ty("Token"), p(","), x(" "), ty("Node"), x(" "), p("}"), x(" "), kw("from"), x(" "), str('"./ast"')],
      [kw("import"), x(" "), p("{"), x(" "), fn("tokenize"), x(" "), p("}"), x(" "), kw("from"), x(" "), str('"./lexer"')],
      [],
      [com("// Guards nested imports before the release cut.")],
      [kw("export"), x(" "), kw("function"), x(" "), fn("parse"), p("("), x("source"), p(":"), x(" "), ty("string"), p(")"), p(":"), x(" "), ty("Node"), p("[] {")],
      [x("  "), kw("const"), x(" tokens"), p(":"), x(" "), ty("Token"), p("[] = "), fn("tokenize"), p("("), x("source"), p(")")],
      [x("  "), kw("const"), x(" out"), p(":"), x(" "), ty("Node"), p("[] = []")],
      [x("  "), kw("let"), x(" depth "), p("= "), num("0")],
      [],
      [x("  "), kw("for"), x(" "), p("("), kw("const"), x(" token "), kw("of"), x(" tokens"), p(") {")],
      [x("    "), kw("if"), x(" "), p("("), x("token"), p("."), x("kind "), p("==="), x(" "), str('"import"'), p(") {")],
      [x("      depth "), p("+="), x(" "), num("1")],
      [x("      "), kw("if"), x(" "), p("("), x("depth "), p("> "), num("8"), p(") "), kw("throw"), x(" "), kw("new"), x(" "), fn("RangeError"), p("("), str('"nested import guard"'), p(")")],
      [x("    "), p("}")],
      [x("    out"), p("."), fn("push"), p("("), fn("toNode"), p("("), x("token"), p("))")],
      [x("  "), p("}")],
      [],
      [x("  "), kw("return"), x(" out")],
      [p("}")],
    ],
  },
  {
    id: "f2",
    name: "server.go",
    path: "cmd/relay/server.go",
    language: "Go",
    lines: [
      [kw("package"), x(" main")],
      [],
      [kw("import"), x(" "), p("("), str('"context"'), p(")")],
      [],
      [kw("func"), x(" "), fn("Serve"), p("("), x("ctx "), ty("context"), p("."), ty("Context"), p(") "), ty("error"), x(" "), p("{")],
      [x("  srv "), p(":= "), fn("newServer"), p("("), x("ctx"), p(")")],
      [x("  "), kw("defer"), x(" srv"), p("."), fn("Close"), p("()")],
      [x("  "), kw("return"), x(" srv"), p("."), fn("ListenAndServe"), p("()")],
      [p("}")],
    ],
  },
  {
    id: "f3",
    name: "ast.ts",
    path: "src/runtime/ast.ts",
    language: "TypeScript",
    lines: [
      [kw("export"), x(" "), kw("type"), x(" "), ty("Token"), x(" "), p("= {")],
      [x("  kind"), p(": "), ty("string")],
      [x("  value"), p(": "), ty("string")],
      [p("}")],
    ],
  },
];

export const fileTree = [
  {
    name: "src/runtime",
    files: ["parser.ts", "lexer.ts", "ast.ts"],
  },
  {
    name: "cmd/relay",
    files: ["server.go", "main.go"],
  },
];

export const cursors: CursorPresence[] = [
  {
    participantId: "p2",
    name: "Mira Solberg",
    initials: "MS",
    fileId: "f1",
    line: 13,
    column: 24,
    colorVar: "--presence-2",
    selection: { line: 13, from: 6, to: 62 },
  },
  {
    participantId: "p3",
    name: "Dev Raghunathan",
    initials: "DR",
    fileId: "f1",
    line: 6,
    column: 12,
    colorVar: "--presence-3",
  },
  {
    participantId: "p4",
    name: "Tomas Lind",
    initials: "TL",
    fileId: "f2",
    line: 6,
    column: 8,
    colorVar: "--presence-4",
  },
];
