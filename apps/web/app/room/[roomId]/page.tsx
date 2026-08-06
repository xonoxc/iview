import { RoomHeader } from "@/components/room/room-header"
import { Workspace } from "@/components/room/workspace"

export function generateStaticParams() {
   return [{ roomId: "backend-session" }]
}

export default function RoomPage() {
   return (
      <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
         <RoomHeader />
         <Workspace />
      </div>
   )
}
