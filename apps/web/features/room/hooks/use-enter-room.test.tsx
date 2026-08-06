// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react"
import { err, ok } from "neverthrow"
import { describe, expect, it, vi } from "vitest"

import { useEnterRoom } from "@/features/room/hooks/use-enter-room"
import { createQueryClient, createWrapper } from "@/features/room/test-utils"

const { getRoomMock } = vi.hoisted(() => ({ getRoomMock: vi.fn() }))

vi.mock("@/features/room/requests/get-room", () => ({
   getRoom: getRoomMock,
}))

const room = {
   id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
   status: "waiting" as const,
   title: "Pair Programming",
   created_at: "2026-08-06T12:00:00Z",
}

describe("useEnterRoom", () => {
   it("loads the room and populates the cache", async () => {
      getRoomMock.mockResolvedValue(ok(room))

      const queryClient = createQueryClient()
      const { result } = renderHook(() => useEnterRoom(room.id), {
         wrapper: createWrapper(queryClient),
      })

      await waitFor(() => expect(result.current.data).toEqual(room))
      expect(queryClient.getQueryData(["room", room.id])).toEqual(room)
   })

   it("surfaces a request error when the room cannot be fetched", async () => {
      getRoomMock.mockResolvedValue(err({ type: "http", status: 404, message: "room not found" }))

      const queryClient = createQueryClient()
      const { result } = renderHook(() => useEnterRoom(room.id), {
         wrapper: createWrapper(queryClient),
      })

      await waitFor(() => expect(result.current.error).toMatchObject({ type: "http", status: 404 }))
   })
})
