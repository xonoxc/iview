import { useMutation } from "@tanstack/react-query"

import { unwrap } from "@/lib/result"
import { createRoom } from "@/features/room/requests/create-room"
import type { CreateRoomInput, CreateRoomResponse } from "@/features/room/types"
import type { RequestError } from "@/lib/http"

export function useCreateRoom() {
   return useMutation<CreateRoomResponse, RequestError, CreateRoomInput>({
      mutationFn: input => unwrap(createRoom(input)),
   })
}
