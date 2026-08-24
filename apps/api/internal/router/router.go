package router

import (
	"net/http"

	"github.com/xonoxc/iview/apps/api/internal/handlers"
)

type Handlers struct {
	RoomHandler     *handlers.RoomHandler
	RealtimeHandler *handlers.RealtimeHandler
}

type Router struct {
	handlers Handlers
}

func NewRouter(h Handlers) *Router {
	return &Router{
		handlers: h,
	}
}

func (r *Router) SetupRoutes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/v1/rooms", r.handlers.RoomHandler.HandleCreateRoom)
	mux.HandleFunc("GET /api/v1/rooms/{id}", r.handlers.RoomHandler.HandleGetRoom)

	/*
	 websocket route
	*/
	mux.HandleFunc(
		"GET /rooms/{id}/ws",
		r.handlers.RealtimeHandler.HandleConnect,
	)

	return mux
}
