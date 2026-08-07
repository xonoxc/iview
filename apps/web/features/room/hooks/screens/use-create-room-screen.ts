import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { requestErrorMessage } from "@/features/room/errors"
import { useCreateRoom } from "@/features/room/hooks/use-create-room"
import {
   createRoomSchema,
   type CreateRoomFormValues,
} from "@/features/room/schemas/room.schema"
import { attempt } from "@/lib/result"

export function useCreateRoomScreen() {
   const router = useRouter()
   const createRoom = useCreateRoom()

   const form = useForm<CreateRoomFormValues>({
      resolver: zodResolver(createRoomSchema),
      defaultValues: {
         title: "",
      },
   })

   const onSubmit = form.handleSubmit(async values => {
      const response = await attempt(createRoom.mutateAsync(values))
      if (response.isOk()) {
         router.push(`/room/${response.value.room_id}`)
      }
   })

   const error = createRoom.error ? requestErrorMessage(createRoom.error) : null

   return {
      form,
      onSubmit,
      isSubmitting: createRoom.isPending,
      error,
   }
}
