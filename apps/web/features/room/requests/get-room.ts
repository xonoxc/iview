import type { ResultAsync } from "neverthrow"
import { expect, requestJson, type RequestError } from "@/lib/http"
import { isRoom, type Room } from "@/features/room/types/room-types"

export function getRoom(roomId: string): ResultAsync<Room, RequestError> {
   return requestJson(`/rooms/${encodeURIComponent(roomId)}`).andThen(
      expect(isRoom, "get room response had an unexpected shape")
   )
}
