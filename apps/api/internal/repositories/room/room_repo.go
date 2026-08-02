package room

import (
	"context"
	"database/sql"

	"github.com/xonoxc/iview/apps/api/internal/domain"
)

type RoomRepo interface {
	Create(ctx context.Context, room *domain.Room) error
	FindByID(ctx context.Context, id string) (*domain.Room, error)
}

type PostgresRoomRepo struct {
	db *sql.DB
}

func NewRoomRepo(db *sql.DB) *PostgresRoomRepo {
	return &PostgresRoomRepo{
		db: db,
	}
}

func (repo *PostgresRoomRepo) Create() error {
	return nil
}

func (repo *PostgresRoomRepo) FindByID(ctx context.Context, id string) (*domain.Room, error) {
	return &domain.Room{}, nil
}
