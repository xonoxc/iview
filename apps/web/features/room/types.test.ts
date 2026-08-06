import { describe, expect, it } from "vitest"
import { isCreateRoomResponse, isRoom } from "@/features/room/types"

const room = {
   id: "room-1",
   status: "waiting",
   title: "Pair Programming",
   created_at: "2026-08-06T12:00:00Z",
}

describe("isRoom", () => {
   it("accepts a valid room", () => {
      expect(isRoom(room)).toBe(true)
   })

   it.each(["waiting", "active", "ended"])("accepts the %s status", status => {
      expect(isRoom({ ...room, status })).toBe(true)
   })

   it("rejects an unknown status", () => {
      expect(isRoom({ ...room, status: "paused" })).toBe(false)
   })

   it("rejects missing fields", () => {
      expect(
         isRoom({ status: "waiting", title: "Pair Programming", created_at: room.created_at })
      ).toBe(false)
   })

   it("rejects non-objects", () => {
      expect(isRoom(null)).toBe(false)
      expect(isRoom("room")).toBe(false)
      expect(isRoom(42)).toBe(false)
   })
})

describe("isCreateRoomResponse", () => {
   it("accepts a valid create response", () => {
      expect(isCreateRoomResponse({ room_id: "room-1", message: "room created" })).toBe(true)
   })

   it("rejects a missing room_id", () => {
      expect(isCreateRoomResponse({ message: "room created" })).toBe(false)
   })

   it("rejects non-objects", () => {
      expect(isCreateRoomResponse(undefined)).toBe(false)
      expect(isCreateRoomResponse(null)).toBe(false)
   })
})
