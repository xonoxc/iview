package main

import (
	"context"
	"database/sql"
	"log"
	"os/signal"
	"syscall"

	_ "github.com/jackc/pgx/v5/stdlib"

	"github.com/xonoxc/iview/apps/api/internal/config"
	"github.com/xonoxc/iview/apps/api/internal/server"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load api config: %v", err)
	}

	sigCtx, cancel := signal.NotifyContext(
		context.Background(),
		syscall.SIGINT,
		syscall.SIGKILL,
	)
	defer cancel()

	db, err := sql.Open("pgx", cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	s := server.New(cfg.Port)

	log.Println("server is running on:", cfg.Port)

	if err := s.Start(sigCtx); err != nil {
		log.Printf("server error: %v", err)
	}
}
