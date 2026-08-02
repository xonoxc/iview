package server

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"time"
)

type Server struct {
	db   *sql.DB
	port string
}

func New(db *sql.DB, port string) *Server {
	return &Server{
		db:   db,
		port: port,
	}
}

func (s *Server) Start(ctx context.Context) error {
	mux := http.NewServeMux()

	mux.HandleFunc("/", handleRoot)

	server := &http.Server{
		Addr:    s.port,
		Handler: mux,
	}

	go func() {
		<-ctx.Done()

		shutdownCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
		defer cancel()

		server.Shutdown(shutdownCtx)
	}()

	err := server.ListenAndServe()

	if errors.Is(err, http.ErrServerClosed) {
		return nil
	}

	return err
}

func handleRoot(w http.ResponseWriter, _ *http.Request) {
	w.Write([]byte("hello\n"))
}
