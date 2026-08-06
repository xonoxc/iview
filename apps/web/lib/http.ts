import { err, ok, type Result, type ResultAsync } from "neverthrow"
import { attempt } from "@/lib/result"

export type RequestError =
   | { type: "network"; message: string; cause?: unknown }
   | { type: "http"; status: number; message: string }
   | { type: "malformed"; message: string; cause?: unknown }

export type ApiResponse<T> = {
   success: boolean
   data?: T
   error?: string
}

const API_BASE_PATH = "/api/v1"

function apiBaseUrl(): string {
   const base = process.env.NEXT_PUBLIC_API_URL
   if (!base) {
      throw new Error("NEXT_PUBLIC_API_URL is not set")
   }
   return base.replace(/\/+$/, "")
}

function isSuccessfulEnvelope(value: unknown): value is ApiResponse<unknown> {
   if (typeof value !== "object" || value === null) return false
   const record = value as Record<string, unknown>
   return record.success === true && "data" in record
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
   let response: Response

   try {
      response = await fetch(`${apiBaseUrl()}${API_BASE_PATH}${path}`, init)
   } catch (cause) {
      throw {
         type: "network",
         message: "request to the API failed",
         cause,
      } satisfies RequestError
   }

   let envelope: unknown
   try {
      envelope = await response.json()
   } catch (cause) {
      throw {
         type: "malformed",
         message: "response was not valid JSON",
         cause,
      } satisfies RequestError
   }

   const apiResponse = envelope as ApiResponse<unknown>
   if (!response.ok) {
      throw {
         type: "http",
         status: response.status,
         message: typeof apiResponse?.error === "string" ? apiResponse.error : response.statusText,
      } satisfies RequestError
   }

   if (!isSuccessfulEnvelope(envelope)) {
      throw {
         type: "malformed",
         message: "response did not match the expected API envelope",
         cause: envelope,
      } satisfies RequestError
   }

   return apiResponse.data
}

export function requestJson(path: string, init?: RequestInit): ResultAsync<unknown, RequestError> {
   return attempt<unknown, RequestError>(request(path, init))
}

export function expect<T>(guard: (value: unknown) => value is T, message: string) {
   return (value: unknown): Result<T, RequestError> =>
      guard(value) ? ok(value) : err({ type: "malformed", message, cause: value })
}
