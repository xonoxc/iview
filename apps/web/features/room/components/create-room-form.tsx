"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateRoomScreen } from "@/features/room/hooks/screens/use-create-room-screen"

export function CreateRoomForm() {
   const { form, onSubmit, isSubmitting, error } = useCreateRoomScreen()
   const { register, formState } = form
   const titleError = formState.errors.title

   return (
      <form onSubmit={onSubmit} noValidate>
         <Label htmlFor="create-room-title">Room title</Label>
         <Input
            id="create-room-title"
            placeholder="e.g. Pair programming"
            {...register("title")}
         />
         {titleError ? <p role="alert">{titleError.message}</p> : null}
         {error ? <p role="alert">{error}</p> : null}
         <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create room"}
         </Button>
      </form>
   )
}
