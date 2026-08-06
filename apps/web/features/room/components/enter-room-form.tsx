"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEnterRoomScreen } from "@/features/room/hooks/screens/use-enter-room-screen"

export function EnterRoomForm() {
   const { form, onSubmit, isSubmitting, error } = useEnterRoomScreen()
   const { register, formState } = form
   const roomIdError = formState.errors.roomId

   return (
      <form onSubmit={onSubmit} noValidate>
         <Label htmlFor="enter-room-id">Room ID</Label>
         <Input
            id="enter-room-id"
            placeholder="00000000-0000-0000-0000-000000000000"
            {...register("roomId")}
         />
         {roomIdError ? <p role="alert">{roomIdError.message}</p> : null}
         {error ? <p role="alert">{error}</p> : null}
         <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Joining…" : "Enter room"}
         </Button>
      </form>
   )
}
