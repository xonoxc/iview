import type { RequestError } from "@/lib/http"

export function requestErrorMessage(error: RequestError): string {
   switch (error.type) {
      case "network":
         return "Could not reach the server. Try again."
      case "http":
         return error.message || "The request failed."
      case "malformed":
         return "The server returned an unexpected response."
   }
}
