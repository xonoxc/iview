export type RoomStatus = "waiting" | "active" | "ended"

export type Room = {
   id: string
   status: RoomStatus
   title: string
   created_at: string
}

export type CreateRoomInput = {
   title: string
}

export type CreateRoomResponse = {
   room_id: string
   message: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
   return typeof value === "object" && value !== null
}

export function isRoom(value: unknown): value is Room {
   if (!isRecord(value)) return false
   return (
      typeof value.id === "string" &&
      (value.status === "waiting" || value.status === "active" || value.status === "ended") &&
      typeof value.title === "string" &&
      typeof value.created_at === "string"
   )
}

export function isCreateRoomResponse(value: unknown): value is CreateRoomResponse {
   if (!isRecord(value)) return false
   return typeof value.room_id === "string" && typeof value.message === "string"
}
