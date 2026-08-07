import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { expect as expectGuard, requestJson } from "@/lib/http"

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

describe("requestJson", () => {
   it("performs a GET against /api/v1 and resolves with the envelope data", async () => {
      const fetchMock = vi
         .fn()
         .mockResolvedValue(jsonResponse({ success: true, data: { ok: 1 } }))
      vi.stubGlobal("fetch", fetchMock)

      const result = await requestJson("/rooms/abc")

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/api/v1/rooms/abc`, undefined)
      expect(result.isOk()).toBe(true)
      if (result.isOk()) expect(result.value).toEqual({ ok: 1 })
   })

   it("passes the request init through", async () => {
      const fetchMock = vi
         .fn()
         .mockResolvedValue(jsonResponse({ success: true, data: null }))
      vi.stubGlobal("fetch", fetchMock)

      await requestJson("/rooms", { method: "POST", body: "{}" })

      expect(fetchMock).toHaveBeenCalledWith(
         `${API_URL}/api/v1/rooms`,
         expect.objectContaining({ method: "POST", body: "{}" })
      )
   })

   it("returns a network error when fetch rejects", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")))

      const result = await requestJson("/rooms")

      expect(result.isErr()).toBe(true)
      if (result.isErr()) expect(result.error.type).toBe("network")
   })

   it("returns an http error for a non-ok response", async () => {
      vi.stubGlobal(
         "fetch",
         vi
            .fn()
            .mockResolvedValue(
               jsonResponse({ success: false, error: "room not found" }, 404)
            )
      )

      const result = await requestJson("/rooms/missing")

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
         expect(result.error).toMatchObject({
            type: "http",
            status: 404,
            message: "room not found",
         })
      }
   })

   it("returns a malformed error when the body is not JSON", async () => {
      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue(new Response("not json", { status: 200 }))
      )

      const result = await requestJson("/rooms")

      expect(result.isErr()).toBe(true)
      if (result.isErr()) expect(result.error.type).toBe("malformed")
   })

   it("returns a malformed error when data is missing from the envelope", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ success: true })))

      const result = await requestJson("/rooms")

      expect(result.isErr()).toBe(true)
      if (result.isErr()) expect(result.error.type).toBe("malformed")
   })

   it("returns a malformed error when success is not true", async () => {
      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue(jsonResponse({ success: false, data: {} }))
      )

      const result = await requestJson("/rooms")

      expect(result.isErr()).toBe(true)
      if (result.isErr()) expect(result.error.type).toBe("malformed")
   })
})

describe("expect", () => {
   const isNumber = (value: unknown): value is number => typeof value === "number"

   it("returns an ok result when the guard passes", () => {
      const result = expectGuard(isNumber, "expected a number")(42)

      expect(result.isOk()).toBe(true)
      if (result.isOk()) expect(result.value).toBe(42)
   })

   it("returns a malformed error when the guard fails", () => {
      const result = expectGuard(isNumber, "expected a number")("nope")

      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
         expect(result.error).toMatchObject({
            type: "malformed",
            message: "expected a number",
         })
      }
   })
})
