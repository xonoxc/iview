// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react"
import { err, ok } from "neverthrow"
import { describe, expect, it, vi } from "vitest"

import { useCreateRoom } from "@/features/room/hooks/use-create-room"
import { createQueryClient, createWrapper } from "@/features/room/test-utils"

const { createRoomMock } = vi.hoisted(() => ({ createRoomMock: vi.fn() }))

vi.mock("@/features/room/requests/create-room", () => ({
   createRoom: createRoomMock,
}))

describe("useCreateRoom", () => {
   it("resolves with the created room response on success", async () => {
      const response = { room_id: "room-1", message: "room created" }
      createRoomMock.mockResolvedValue(ok(response))

      const queryClient = createQueryClient()
      const { result } = renderHook(() => useCreateRoom(), {
         wrapper: createWrapper(queryClient),
      })

      await act(async () => {
         await result.current.mutateAsync({ title: "Pair Programming" })
      })

      expect(createRoomMock).toHaveBeenCalledWith({ title: "Pair Programming" })
      await waitFor(() => expect(result.current.data).toEqual(response))
   })

   it("surfaces the request error when creation fails", async () => {
      createRoomMock.mockResolvedValue(
         err({ type: "http", status: 400, message: "invalid request" })
      )

      const queryClient = createQueryClient()
      const { result } = renderHook(() => useCreateRoom(), {
         wrapper: createWrapper(queryClient),
      })

      await act(async () => {
         await expect(
            result.current.mutateAsync({ title: "Pair Programming" })
         ).rejects.toMatchObject({
            type: "http",
            status: 400,
         })
      })

      await waitFor(() =>
         expect(result.current.error).toMatchObject({ type: "http", status: 400 })
      )
   })
})
