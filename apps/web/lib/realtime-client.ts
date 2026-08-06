type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

class RealtimeClient {
   private socket: WebSocket | null = null
   public status: ConnectionStatus = "disconnected"

   constructor(private readonly url: string = API_URL) {
      this.url = url.replace(/^http/, "ws")
   }

   connect(roomdId: string) {
      this.socket = new WebSocket(this.url + "/api/v1/rooms/" + roomdId + "/ws")

      this.attachListeners()
   }

   disconnect() {
      this.socket?.close()
      this.socket = null
   }

   private attachListeners() {
      if (!this.socket) return

      this.socket.onopen = () => (this.status = "connected")

      this.socket.onclose = () => {
         this.status = "disconnected"
         this.socket = null
      }

      this.socket.onerror = () => {
         console.error("WebSocket error:")
      }
   }
}

export const realtimeClient = new RealtimeClient()
