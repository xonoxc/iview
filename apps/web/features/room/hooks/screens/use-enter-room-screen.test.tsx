// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react"
import { err, ok, type Result } from "neverthrow"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useEnterRoomScreen } from "@/features/room/hooks/screens/use-enter-room-screen"
import { createQueryClient, createWrapper } from "@/features/room/test-utils"
import type { RequestError } from "@/lib/http"
import type { Room } from "@/features/room/types"

const { routerPush, getRoomMock } = vi.hoisted(() => ({
   routerPush: vi.fn(),
   getRoomMock: vi.fn(),
}))

vi.mock("next/navigation", () => ({
   useRouter: () => ({ push: routerPush }),
}))

vi.mock("@/features/room/requests/get-room", () => ({
   getRoom: getRoomMock,
}))

const room = {
   id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
   status: "waiting" as const,
   title: "Pair Programming",
   created_at: "2026-08-06T12:00:00Z",
}

beforeEach(() => {
   routerPush.mockReset()
   getRoomMock.mockReset()
})

function submitEvent() {
   return { preventDefault: vi.fn() } as unknown as React.BaseSyntheticEvent
}

describe("useEnterRoomScreen", () => {
   it("validates the room id before verifying", async () => {
      const queryClient = createQueryClient()
      const { result } = renderHook(() => useEnterRoomScreen(), {
         wrapper: createWrapper(queryClient),
      })

      await act(async () => {
         result.current.form.setValue("roomId", "not-a-uuid")
         await result.current.onSubmit(submitEvent())
      })

      expect(result.current.form.getFieldState("roomId").error).toBeDefined()
      expect(getRoomMock).not.toHaveBeenCalled()
      expect(routerPush).not.toHaveBeenCalled()
   })

   it("verifies the room and navigates on success, warming the cache", async () => {
      getRoomMock.mockResolvedValue(ok(room))
      const queryClient = createQueryClient()
      const { result } = renderHook(() => useEnterRoomScreen(), {
         wrapper: createWrapper(queryClient),
      })

      await act(async () => {
         result.current.form.setValue("roomId", room.id)
         result.current.onSubmit(submitEvent())
      })

      await waitFor(() => expect(routerPush).toHaveBeenCalledWith(`/room/${room.id}`))
      expect(queryClient.getQueryData(["room", room.id])).toEqual(room)
   })

   it("maps a missing room to a field-facing error without navigating", async () => {
      getRoomMock.mockResolvedValue(err({ type: "http", status: 404, message: "room not found" }))
      const queryClient = createQueryClient()
      const { result } = renderHook(() => useEnterRoomScreen(), {
         wrapper: createWrapper(queryClient),
      })

      await act(async () => {
         result.current.form.setValue("roomId", room.id)
         result.current.onSubmit(submitEvent())
      })

      await waitFor(() => expect(result.current.error).toBe("Room not found"))
      expect(routerPush).not.toHaveBeenCalled()
   })

   it("reports pending state while verifying", async () => {
      let resolveFetch: (value: Result<Room, RequestError>) => void
      getRoomMock.mockImplementation(
         () =>
            new Promise<Result<Room, RequestError>>(resolve => {
               resolveFetch = resolve
            })
      )
      const queryClient = createQueryClient()
      const { result } = renderHook(() => useEnterRoomScreen(), {
         wrapper: createWrapper(queryClient),
      })

      await act(async () => {
         result.current.form.setValue("roomId", room.id)
         result.current.onSubmit(submitEvent())
      })

      await waitFor(() => expect(result.current.isSubmitting).toBe(true))

      await act(async () => {
         resolveFetch!(ok(room))
      })

      await waitFor(() => expect(routerPush).toHaveBeenCalledWith(`/room/${room.id}`))
      await waitFor(() => expect(result.current.isSubmitting).toBe(false))
   })
})
