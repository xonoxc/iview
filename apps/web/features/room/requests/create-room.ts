import type { ResultAsync } from "neverthrow"
import { expect, requestJson, type RequestError } from "@/lib/http"
import {
   isCreateRoomResponse,
   type CreateRoomInput,
   type CreateRoomResponse,
} from "@/features/room/types"

export function createRoom(input: CreateRoomInput): ResultAsync<CreateRoomResponse, RequestError> {
   return requestJson("/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
   }).andThen(expect(isCreateRoomResponse, "create room response had an unexpected shape"))
}
