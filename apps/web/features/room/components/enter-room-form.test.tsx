// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { EnterRoomForm } from "@/features/room/components/enter-room-form"

const { screenMock } = vi.hoisted(() => ({ screenMock: vi.fn() }))

vi.mock("@/features/room/hooks/screens/use-enter-room-screen", () => ({
   useEnterRoomScreen: () => screenMock(),
}))

type ScreenShape = {
   form: {
      register: (name: string) => { name: string }
      handleSubmit: () => void
      formState: { errors: Record<string, { message?: string; type?: string }> }
   }
   onSubmit: () => void
   isSubmitting: boolean
   error: string | null
}

function makeScreen(overrides: Partial<ScreenShape> = {}): ScreenShape {
   return {
      form: {
         register: (name: string) => ({ name }),
         handleSubmit: vi.fn(),
         formState: { errors: {} },
      },
      onSubmit: vi.fn(),
      isSubmitting: false,
      error: null,
      ...overrides,
   }
}

describe("EnterRoomForm", () => {
   it("renders the room id field and submit button", () => {
      screenMock.mockReturnValue(makeScreen())
      render(<EnterRoomForm />)

      expect(screen.getByLabelText("Room ID")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Enter room" })).toBeInTheDocument()
   })

   it("renders field validation messages", () => {
      screenMock.mockReturnValue(
         makeScreen({
            form: {
               register: (name: string) => ({ name }),
               handleSubmit: vi.fn(),
               formState: { errors: { roomId: { message: "Enter a valid room ID" } } },
            },
         })
      )
      render(<EnterRoomForm />)

      expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid room ID")
   })

   it("renders application errors such as a missing room", () => {
      screenMock.mockReturnValue(makeScreen({ error: "Room not found" }))
      render(<EnterRoomForm />)

      expect(screen.getByRole("alert")).toHaveTextContent("Room not found")
   })

   it("disables the submit button while pending", () => {
      screenMock.mockReturnValue(makeScreen({ isSubmitting: true }))
      render(<EnterRoomForm />)

      expect(screen.getByRole("button", { name: "Joining…" })).toBeDisabled()
   })

   it("triggers the exposed submit workflow on submission", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      screenMock.mockReturnValue(makeScreen({ onSubmit }))
      render(<EnterRoomForm />)

      await user.click(screen.getByRole("button", { name: "Enter room" }))

      expect(onSubmit).toHaveBeenCalledTimes(1)
   })
})
