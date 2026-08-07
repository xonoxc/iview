import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { requestErrorMessage } from "@/features/room/errors"
import { roomQueryOptions } from "@/features/room/queries/room.queries"
import {
   enterRoomSchema,
   type EnterRoomFormValues,
} from "@/features/room/schemas/room.schema"
import type { Room } from "@/features/room/types/room-types"
import type { RequestError } from "@/lib/http"

function isRoomNotFound(error: RequestError): boolean {
   return error.type === "http" && error.status === 404
}

export function useEnterRoomScreen() {
   const router = useRouter()
   const queryClient = useQueryClient()

   const form = useForm<EnterRoomFormValues>({
      resolver: zodResolver(enterRoomSchema),
      defaultValues: {
         roomId: "",
      },
   })

   const verifyRoom = useMutation<Room, RequestError, string>({
      mutationFn: roomId => queryClient.fetchQuery(roomQueryOptions(roomId)),
   })

   const onSubmit = form.handleSubmit(values => {
      verifyRoom.mutate(values.roomId, {
         onSuccess: room => router.push(`/room/${room.id}`),
      })
   })

   const error = verifyRoom.error
      ? isRoomNotFound(verifyRoom.error)
         ? "Room not found"
         : requestErrorMessage(verifyRoom.error)
      : null

   return {
      form,
      onSubmit,
      isSubmitting: verifyRoom.isPending,
      error,
   }
}
