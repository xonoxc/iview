import { attemptSync } from "@/lib/result"
import type { RealtimeMessage } from "@/features/room/types/message-types"

type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

type MessageListener = (message: RealtimeMessage) => void
type StatusListener = (status: ConnectionStatus) => void

class RealtimeClient {
   private socket: WebSocket | null = null
   public status: ConnectionStatus = "disconnected"
   public listeners = new Set<MessageListener>()
   private readonly statusListeners = new Set<StatusListener>()

   constructor(private readonly url: string = API_URL) {
      this.url = url.replace(/^http/, "ws")
   }

   connect(roomdId: string) {
      if (!this.cannConnect) return

      this.setStatus("connecting")

      const socket = new WebSocket(this.url + "/api/v1/rooms/" + roomdId + "/ws")
      this.socket = socket

      this.attachListeners(socket)
   }

   private get cannConnect() {
      return !this.socket || this.socket.readyState === WebSocket.CLOSED
   }

   private get isConnected() {
      return this.socket && this.socket.readyState === WebSocket.OPEN
   }

   public send(message: RealtimeMessage): boolean {
      if (!this.isConnected) return false

      this.socket!.send(JSON.stringify(message))
      return true
   }

   public subscribe(listener: MessageListener) {
      this.listeners.add(listener)

      return () => {
         this.listeners.delete(listener)
      }
   }

   private emit(message: RealtimeMessage) {
      for (const listener of this.listeners) listener(message)
   }

   subscribeStatus(listener: StatusListener) {
      this.statusListeners.add(listener)

      return () => {
         this.statusListeners.delete(listener)
      }
   }

   private setStatus(status: ConnectionStatus) {
      this.status = status

      for (const listener of this.statusListeners) {
         listener(status)
      }
   }

   private attachListeners(socket: WebSocket) {
      socket.onopen = () => {
         if (this.socket !== socket) return
         this.setStatus("connected")
      }

      socket.onclose = () => {
         if (this.socket !== socket) return
         this.disconnect()
      }

      socket.onerror = () => {
         if (this.socket !== socket) return
         console.error("WebSocket error:")
      }

      socket.onmessage = event => {
         const message = attemptSync<RealtimeMessage>(() => JSON.parse(event.data))
         if (message.isErr()) {
            console.error("malformed message:", event.data)
            return
         }

         this.emit(message.value)
      }
   }

   disconnect() {
      this.setStatus("disconnected")
      this.socket?.close()
      this.socket = null
   }
}

export const realtimeClient = new RealtimeClient()
