import { CreateRoomForm } from "@/features/room/components/create-room-form"
import { EnterRoomForm } from "@/features/room/components/enter-room-form"

export default function Home() {
   return (
      <main className="flex min-h-dvh items-center justify-center gap-16 bg-background p-8 text-foreground">
         <CreateRoomForm />
         <EnterRoomForm />
      </main>
   )
}
