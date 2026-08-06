import { describe, expect, it } from "vitest"
import { attempt, attemptSync, unwrap } from "@/lib/result"

describe("attempt", () => {
   it("resolves a fulfilled promise to an ok result", async () => {
      const result = await attempt(Promise.resolve(42))

      expect(result.isOk()).toBe(true)
      if (result.isOk()) expect(result.value).toBe(42)
   })

   it("maps a rejected promise to an err result", async () => {
      const boom = new Error("boom")
      const result = await attempt(Promise.reject(boom))

      expect(result.isErr()).toBe(true)
      if (result.isErr()) expect(result.error).toBe(boom)
   })
})

describe("attemptSync", () => {
   it("returns an ok result for a non-throwing function", () => {
      const result = attemptSync(() => "value")

      expect(result.isOk()).toBe(true)
      if (result.isOk()) expect(result.value).toBe("value")
   })

   it("returns an err result when the function throws", () => {
      const boom = new Error("boom")
      const result = attemptSync(() => {
         throw boom
      })

      expect(result.isErr()).toBe(true)
      if (result.isErr()) expect(result.error).toBe(boom)
   })
})

describe("unwrap", () => {
   it("resolves with the value of an ok result", async () => {
      await expect(unwrap(attempt(Promise.resolve(42)))).resolves.toBe(42)
   })

   it("throws the error of an err result", async () => {
      const boom = new Error("boom")
      await expect(unwrap(attempt(Promise.reject(boom)))).rejects.toBe(boom)
   })
})
