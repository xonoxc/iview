import type { Metadata } from "next"

import { MeetingRoom } from "@/components/room/meeting-room"

export const metadata: Metadata = {
   title: "Session room — iview",
   description:
      "Live session room with video stage, collaborative code workspace, participant panel and ephemeral chat.",
}

export function generateStaticParams() {
   return [{ roomId: "backend-session" }]
}

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
   const { roomId } = await params
   return (
      <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
         <MeetingRoom roomId={roomId} />
      </div>
   )
}