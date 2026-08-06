import { describe, expect, it } from "vitest"
import { createRoomSchema, enterRoomSchema } from "@/features/room/schemas/room.schema"

const validUuid = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"

describe("createRoomSchema", () => {
   it("rejects an empty title", () => {
      const result = createRoomSchema.safeParse({ title: "" })
      expect(result.success).toBe(false)
   })

   it("rejects a 2 character title", () => {
      const result = createRoomSchema.safeParse({ title: "ab" })
      expect(result.success).toBe(false)
   })

   it("accepts a 3 character title", () => {
      const result = createRoomSchema.safeParse({ title: "abc" })
      expect(result.success).toBe(true)
   })

   it("accepts a 100 character title", () => {
      const result = createRoomSchema.safeParse({ title: "x".repeat(100) })
      expect(result.success).toBe(true)
   })

   it("rejects a 101 character title", () => {
      const result = createRoomSchema.safeParse({ title: "x".repeat(101) })
      expect(result.success).toBe(false)
   })
})

describe("enterRoomSchema", () => {
   it("accepts a valid uuid", () => {
      const result = enterRoomSchema.safeParse({ roomId: validUuid })
      expect(result.success).toBe(true)
   })

   it("rejects an invalid uuid", () => {
      const result = enterRoomSchema.safeParse({ roomId: "not-a-uuid" })
      expect(result.success).toBe(false)
   })

   it("rejects an empty room id", () => {
      const result = enterRoomSchema.safeParse({ roomId: "" })
      expect(result.success).toBe(false)
   })
})
