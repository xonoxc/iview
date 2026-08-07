// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { CreateRoomForm } from "@/features/room/components/create-room-form"

const { screenMock } = vi.hoisted(() => ({ screenMock: vi.fn() }))

vi.mock("@/features/room/hooks/screens/use-create-room-screen", () => ({
   useCreateRoomScreen: () => screenMock(),
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

describe("CreateRoomForm", () => {
   it("renders the room title field and submit button", () => {
      screenMock.mockReturnValue(makeScreen())
      render(<CreateRoomForm />)

      expect(screen.getByLabelText("Room title")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Create room" })).toBeInTheDocument()
   })

   it("renders field validation messages", () => {
      screenMock.mockReturnValue(
         makeScreen({
            form: {
               register: (name: string) => ({ name }),
               handleSubmit: vi.fn(),
               formState: {
                  errors: { title: { message: "Title must be at least 3 characters" } },
               },
            },
         })
      )
      render(<CreateRoomForm />)

      expect(screen.getByRole("alert")).toHaveTextContent(
         "Title must be at least 3 characters"
      )
   })

   it("renders application errors", () => {
      screenMock.mockReturnValue(
         makeScreen({ error: "Could not reach the server. Try again." })
      )
      render(<CreateRoomForm />)

      expect(screen.getByRole("alert")).toHaveTextContent("Could not reach the server")
   })

   it("disables the submit button while pending", () => {
      screenMock.mockReturnValue(makeScreen({ isSubmitting: true }))
      render(<CreateRoomForm />)

      expect(screen.getByRole("button", { name: "Creating…" })).toBeDisabled()
   })

   it("triggers the exposed submit workflow on submission", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      screenMock.mockReturnValue(makeScreen({ onSubmit }))
      render(<CreateRoomForm />)

      await user.click(screen.getByRole("button", { name: "Create room" }))

      expect(onSubmit).toHaveBeenCalledTimes(1)
   })
})
