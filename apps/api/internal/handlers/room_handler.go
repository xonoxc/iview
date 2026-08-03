package handlers

import (
	"net/http"

	"github.com/xonoxc/iview/apps/api/internal/domain"
	"github.com/xonoxc/iview/apps/api/internal/services"
)

type RoomHandler struct {
	roomService services.RoomService
}

func NewRoomHandler(rs services.RoomService) *RoomHandler {
	return &RoomHandler{
		roomService: rs,
	}
}

// payload validator for this specific request
type CreateRoomRequest struct {
	Title string `json:"title" validate:"required,min=3,max=100"`
}

func (rsi *RoomHandler) HandleCreateRoom(w http.ResponseWriter, r *http.Request) {
	var req CreateRoomRequest

	if !decodeJSON(w, r, &req) {
		return
	}

	if err := validate.Struct(req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request")
		return
	}

	roomId, err := rsi.roomService.CreateRoom(r.Context(), &domain.Room{
		Title: req.Title,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create room")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]string{
		"room_id": roomId,
		"message": "room created",
	})
}

func (rsi *RoomHandler) HandleGetRoom(w http.ResponseWriter, r *http.Request) {
	roomId := r.PathValue("id")

	if err := validate.Var(roomId, "required,uuid"); err != nil {
		writeError(w, http.StatusBadRequest, "invalid room id")
		return
	}

	room, err := rsi.roomService.GetRoomByID(r.Context(), roomId)
	if err != nil {
		writeError(w, http.StatusNotFound, "room not found")
		return
	}

	writeJSON(w, http.StatusOK, room)
}
