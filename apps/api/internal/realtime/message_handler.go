package realtime

import "strings"

type MessageHandler struct {
	hub *Hub
}

func NewMessageHandler(hub *Hub) *MessageHandler {
	return &MessageHandler{
		hub: hub,
	}
}

func (h *MessageHandler) Handle(sender *Client, msg Message) {
	msg.From = sender.Id

	if strings.TrimSpace(msg.To) == "" {
		return
	}

	switch msg.Type {
	case MessageWebRTCOffer,
		MessageWebRTCAnswer,
		MessageWebRTCIce:
		h.hub.SendTo(sender.RoomId, msg.To, msg)

	default:
		h.hub.BroadCast(sender.RoomId, msg)
	}
}
