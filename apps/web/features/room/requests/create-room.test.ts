import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createRoom } from "@/features/room/requests/create-room"

const API_URL = "http://localhost:8080"

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

describe("createRoom", () => {
   it("POSTs the input to /api/v1/rooms and resolves with the response", async () => {
      const fetchMock = vi
         .fn()
         .mockResolvedValue(
            jsonResponse(
               { success: true, data: { room_id: "room-1", message: "room created" } },
               201
            )
         )
      vi.stubGlobal("fetch", fetchMock)

      const result = await createRoom({ title: "Pair Programming" })

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/api/v1/rooms`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ title: "Pair Programming" }),
      })
      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
         expect(result.value).toEqual({ room_id: "room-1", message: "room created" })
      }
   })

   it("returns an http error on a non-ok response", async () => {
      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue(jsonResponse({ success: false, error: "invalid request" }, 400))
      )

      const result = await createRoom({ title: "Pair Programming" })

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
         expect(result.error).toMatchObject({
            type: "http",
            status: 400,
            message: "invalid request",
         })
      }
   })

   it("returns a malformed error when data has an unexpected shape", async () => {
      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue(jsonResponse({ success: true, data: { nope: 1 } }, 201))
      )

      const result = await createRoom({ title: "Pair Programming" })

      expect(result.isErr()).toBe(true)
      if (result.isErr()) expect(result.error.type).toBe("malformed")
   })
})
