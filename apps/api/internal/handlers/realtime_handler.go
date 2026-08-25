package handlers

import (
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/xonoxc/iview/apps/api/internal/realtime"
	"github.com/xonoxc/iview/apps/api/internal/services"
)

type RealtimeHandler struct {
	hub         *realtime.Hub
	roomService services.RoomService
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewRealtimeHandler(hub *realtime.Hub, roomService services.RoomService) *RealtimeHandler {
	return &RealtimeHandler{
		hub:         hub,
		roomService: roomService,
	}
}

func (h *RealtimeHandler) HandleConnect(w http.ResponseWriter, r *http.Request) {
	roomId := r.PathValue("id")

	_, err := h.roomService.GetRoomByID(r.Context(), roomId)
	if err != nil {
		writeError(w, http.StatusNotFound, "room not found")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("upgrade failed: %v", err)
		return
	}

	client := realtime.NewClient(uuid.NewString(), roomId, conn)
	h.hub.Register(client)

	go client.WritePump(h.hub)

	client.ReadPump(h.hub)
}
