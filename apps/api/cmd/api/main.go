package main

import (
	"context"
	"log"
	"os/signal"
	"syscall"

	"github.com/xonoxc/iview/apps/api/internal/server"
)

func main() {
	sigCtx, cancel := signal.NotifyContext(
		context.Background(),
		syscall.SIGINT,
		syscall.SIGKILL,
	)
	defer cancel()

	port := ":8080"

	s := server.New(port)

	log.Println("server is running on:", port)

	if err := s.Start(sigCtx); err != nil {
		log.Printf("server error: %v", err)
	}
}
