import { z } from "zod"

export const createRoomSchema = z.object({
   title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be at most 100 characters"),
})

export type CreateRoomFormValues = z.infer<typeof createRoomSchema>

export const enterRoomSchema = z.object({
   roomId: z.string().uuid("Enter a valid room ID"),
})

export type EnterRoomFormValues = z.infer<typeof enterRoomSchema>
