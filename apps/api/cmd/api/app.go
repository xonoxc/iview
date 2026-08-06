package main

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"

	"github.com/xonoxc/iview/apps/api/internal/config"
	"github.com/xonoxc/iview/apps/api/internal/database"
	"github.com/xonoxc/iview/apps/api/internal/handlers"
	"github.com/xonoxc/iview/apps/api/internal/realtime"
	"github.com/xonoxc/iview/apps/api/internal/repositories/room"
	"github.com/xonoxc/iview/apps/api/internal/router"
	"github.com/xonoxc/iview/apps/api/internal/server"
	"github.com/xonoxc/iview/apps/api/internal/services"
)

type App struct {
	server *server.Server
	db     *sql.DB
	port   string
}

func NewApp(ctx context.Context) (*App, error) {
	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("load config: %w", err)
	}

	db, err := database.Connect(ctx, cfg.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("connect database: %w", err)
	}

	roomRepo := room.NewRoomRepo(db)
	roomService := services.NewRoomService(roomRepo)

	roomHandler := handlers.NewRoomHandler(*roomService)

	hub := realtime.NewHub()
	wsHandler := handlers.NewRealtimeHandler(
		hub,
		*roomService,
	)

	rt := router.NewRouter(
		router.Handlers{
			RoomHandler:     roomHandler,
			RealtimeHandler: wsHandler,
		})

	s := server.New(rt, cfg.Port)

	return &App{
		server: s,
		db:     db,
		port:   cfg.Port,
	}, nil
}

func (a *App) Run(ctx context.Context) error {
	slog.Info("API listening", "port", a.port)
	return a.server.Start(ctx)
}

func (a *App) Close() error {
	return a.db.Close()
}
