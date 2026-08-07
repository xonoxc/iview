type WebRTCOfferMessage = {
   type: "webrtc.offer"
   from: string
   to: string
   payload: RTCSessionDescriptionInit
}

type WebRTCAnswerMessage = {
   type: "webrtc.answer"
   from: string
   to: string
   payload: RTCSessionDescriptionInit
}

type WebRTCIceMessage = {
   type: "webrtc.ice"
   from: string
   to: string
   payload: RTCIceCandidateInit
}

type PresenceJoinMessage = {
   type: "presence.join"
   from: string
   payload: null
}

export type RealtimeMessage =
   | WebRTCOfferMessage
   | WebRTCAnswerMessage
   | WebRTCIceMessage
   | PresenceJoinMessage
