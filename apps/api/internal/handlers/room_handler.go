package handlers

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/xonoxc/iview/apps/api/internal/domain"
	"github.com/xonoxc/iview/apps/api/internal/services"
)

type RoomHandler struct {
	roomService services.RoomService
}

func NewRoomService(rs services.RoomService) *RoomHandler {
	return &RoomHandler{
		roomService: rs,
	}
}

func (rsi *RoomHandler) HandleCreateRoom(w http.ResponseWriter, r *http.Request) {
}
