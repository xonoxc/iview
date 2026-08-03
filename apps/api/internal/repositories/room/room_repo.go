package room

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/xonoxc/iview/apps/api/internal/domain"
)

type RoomRepo interface {
	Create(ctx context.Context, room *domain.Room) error
	FindByID(ctx context.Context, id string) (*domain.Room, error)
}

var ErrRoomNotFound = errors.New("room not found")

type PostgresRoomRepo struct {
	db *sql.DB
}

func NewRoomRepo(db *sql.DB) *PostgresRoomRepo {
	return &PostgresRoomRepo{
		db: db,
	}
}

func (repo *PostgresRoomRepo) Create(ctx context.Context, room *domain.Room) error {
	query := `
		INSERT INTO rooms DEFAULT VALUES
		RETURNING id, status, created_at
	`

	err := repo.db.QueryRowContext(ctx, query).Scan(
		&room.ID,
		&room.Status,
		&room.CreatedAt,
	)
	if err != nil {
		return fmt.Errorf("create room: %w", err)
	}

	return nil
}

func (repo *PostgresRoomRepo) FindByID(ctx context.Context, id string) (*domain.Room, error) {
	query := `
	    SELECT id, status, created_at
		FROM rooms
		WHERE id = $1
	`

	var room domain.Room

	err := repo.db.QueryRowContext(ctx, query, id).Scan(
		&room.ID,
		&room.Status,
		&room.CreatedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrRoomNotFound
	}

	if err != nil {
		return nil, fmt.Errorf("find room: %w", err)
	}

	return &room, nil
}
