// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { useCreateRoomScreen } from "@/features/room/hooks/screens/use-create-room-screen"
import type { RequestError } from "@/lib/http"

const { routerPush, mutation } = vi.hoisted(() => ({
   routerPush: vi.fn(),
   mutation: {
      mutateAsync: vi.fn(),
      error: null as null | RequestError,
      isPending: false,
   },
}))

vi.mock("next/navigation", () => ({
   useRouter: () => ({ push: routerPush }),
}))

vi.mock("@/features/room/hooks/use-create-room", () => ({
   useCreateRoom: () => mutation,
}))

beforeEach(() => {
   routerPush.mockReset()
   mutation.mutateAsync.mockReset()
   mutation.error = null
   mutation.isPending = false
})

function submitEvent() {
   return { preventDefault: vi.fn() } as unknown as React.BaseSyntheticEvent
}

describe("useCreateRoomScreen", () => {
   it("validates the title before creating", async () => {
      const { result } = renderHook(() => useCreateRoomScreen())

      await act(async () => {
         result.current.form.setValue("title", "ab")
         await result.current.onSubmit(submitEvent())
      })

      expect(result.current.form.getFieldState("title").error).toBeDefined()
      expect(mutation.mutateAsync).not.toHaveBeenCalled()
      expect(routerPush).not.toHaveBeenCalled()
   })

   it("creates the room and navigates on success", async () => {
      mutation.mutateAsync.mockResolvedValue({
         room_id: "room-1",
         message: "room created",
      })
      const { result } = renderHook(() => useCreateRoomScreen())

      await act(async () => {
         result.current.form.setValue("title", "Pair Programming")
         await result.current.onSubmit(submitEvent())
      })

      expect(mutation.mutateAsync).toHaveBeenCalledWith({ title: "Pair Programming" })
      expect(routerPush).toHaveBeenCalledWith("/room/room-1")
   })

   it("does not navigate when creation fails and maps the error", async () => {
      mutation.mutateAsync.mockRejectedValue({
         type: "http",
         status: 400,
         message: "invalid request",
      })
      mutation.error = { type: "http", status: 400, message: "invalid request" }
      const { result } = renderHook(() => useCreateRoomScreen())

      await act(async () => {
         result.current.form.setValue("title", "Pair Programming")
         await result.current.onSubmit(submitEvent())
      })

      expect(routerPush).not.toHaveBeenCalled()
      expect(result.current.error).toBe("invalid request")
   })

   it("maps network failures to a friendly message", async () => {
      mutation.error = { type: "network", message: "request to the API failed" }
      const { result, rerender } = renderHook(() => useCreateRoomScreen())

      rerender()

      expect(result.current.error).toBe("Could not reach the server. Try again.")
   })

   it("reports pending state while submitting", async () => {
      mutation.isPending = true
      const { result, rerender } = renderHook(() => useCreateRoomScreen())

      rerender()

      expect(result.current.isSubmitting).toBe(true)
   })
})
