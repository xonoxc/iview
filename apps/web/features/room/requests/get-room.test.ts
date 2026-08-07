import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getRoom } from "@/features/room/requests/get-room"

const API_URL = "http://localhost:8080"

const room = {
   id: "room-1",
   status: "waiting",
   title: "Pair Programming",
   created_at: "2026-08-06T12:00:00Z",
}

function jsonResponse(body: unknown, status = 200): Response {
   return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
   })
}

beforeEach(() => {
   vi.stubEnv("NEXT_PUBLIC_API_URL", API_URL)
})

afterEach(() => {
   vi.unstubAllEnvs()
   vi.unstubAllGlobals()
})

describe("getRoom", () => {
   it("GETs the room and resolves with the room", async () => {
      const fetchMock = vi
         .fn()
         .mockResolvedValue(jsonResponse({ success: true, data: room }))
      vi.stubGlobal("fetch", fetchMock)

      const result = await getRoom("room-1")

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/api/v1/rooms/room-1`, undefined)
      expect(result.isOk()).toBe(true)
      if (result.isOk()) expect(result.value).toEqual(room)
   })

   it("URL-encodes the room id", async () => {
      const fetchMock = vi
         .fn()
         .mockResolvedValue(jsonResponse({ success: true, data: room }))
      vi.stubGlobal("fetch", fetchMock)

      await getRoom("a/b?c=d")

      expect(fetchMock).toHaveBeenCalledWith(
         `${API_URL}/api/v1/rooms/a%2Fb%3Fc%3Dd`,
         undefined
      )
   })

   it("returns an http error for a missing room", async () => {
      vi.stubGlobal(
         "fetch",
         vi
            .fn()
            .mockResolvedValue(
               jsonResponse({ success: false, error: "room not found" }, 404)
            )
      )

      const result = await getRoom("missing")

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
         expect(result.error).toMatchObject({
            type: "http",
            status: 404,
            message: "room not found",
         })
      }
   })

   it("returns a malformed error when data has an unexpected shape", async () => {
      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue(jsonResponse({ success: true, data: { id: 1 } }))
      )

      const result = await getRoom("room-1")

      expect(result.isErr()).toBe(true)
      if (result.isErr()) expect(result.error.type).toBe("malformed")
   })
})
