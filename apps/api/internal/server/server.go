package server

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/xonoxc/iview/apps/api/internal/router"
)

type Server struct {
	router *router.Router
	port   string
}

func New(rou *router.Router, port string) *Server {
	return &Server{
		router: rou,
		port:   port,
	}
}

func (s *Server) Start(ctx context.Context) error {
	mux := http.NewServeMux()

	mux.Handle("/api/v1/",
		http.StripPrefix("/api/v1/", s.router.SetupRoutes()),
	)

	server := &http.Server{
		Addr:    s.port,
		Handler: mux,
	}

	go func() {
		<-ctx.Done()

		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		server.Shutdown(shutdownCtx)
	}()

	err := server.ListenAndServe()

	if errors.Is(err, http.ErrServerClosed) {
		return nil
	}

	return err
}
