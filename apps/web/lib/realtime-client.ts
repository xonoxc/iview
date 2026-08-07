type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

class RealtimeClient {
   private socket: WebSocket | null = null
   public status: ConnectionStatus = "disconnected"

   constructor(private readonly url: string = API_URL) {
      this.url = url.replace(/^http/, "ws")
   }

   connect(roomdId: string) {
      if (!this.cannConnect) return

      this.status = "connecting"

      const socket = new WebSocket(this.url + "/api/v1/rooms/" + roomdId + "/ws")
      this.socket = socket

      this.attachListeners(socket)
   }

   private get cannConnect() {
      return !this.socket || this.socket.readyState === WebSocket.CLOSED
   }

   disconnect() {
      this.socket?.close()
      this.socket = null
   }

   private attachListeners(socket: WebSocket) {
      socket.onopen = () => {
         if (this.socket !== socket) return
         this.status = "connected"
      }

      socket.onclose = () => {
         if (this.socket !== socket) return
         this.status = "disconnected"
         this.socket = null
      }

      socket.onerror = () => {
         if (this.socket !== socket) return
         console.error("WebSocket error:")
      }
   }
}

export const realtimeClient = new RealtimeClient()
