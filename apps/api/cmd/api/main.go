package main

import (
	"context"
	"log"
	"os/signal"
	"syscall"
)

func main() {
	ctx, cancel := signal.NotifyContext(
		context.Background(),
		syscall.SIGINT,
		syscall.SIGTERM,
	)
	defer cancel()

	app, err := NewApp(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer app.Close()

	if err := app.Run(ctx); err != nil {
		log.Fatal(err)
	}
}
