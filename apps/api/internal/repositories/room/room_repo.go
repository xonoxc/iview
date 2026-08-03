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

	UpdateStatus(ctx context.Context, id string, status domain.RoomStatus) error
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
		INSERT INTO rooms (title) 
		VALUES ($1)
		RETURNING id, title, status, created_at
	`

	err := repo.db.QueryRowContext(ctx, query, room.Title).Scan(
		&room.ID,
		&room.Title,
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
	    SELECT id, title, status, created_at
		FROM rooms
		WHERE id = $1
	`

	var room domain.Room

	err := repo.db.QueryRowContext(ctx, query, id).Scan(
		&room.ID,
		&room.Title,
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

func (repo *PostgresRoomRepo) UpdateStatus(ctx context.Context, id string, status domain.RoomStatus) error {
	query := `
		UPDATE rooms
		SET status = $1
		WHERE id = $2
	`

	res, err := repo.db.ExecContext(ctx, query, status, id)
	if err != nil {
		return fmt.Errorf("update room status: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("get affected rows: %w", err)
	}

	if rows == 0 {
		return ErrRoomNotFound
	}

	return nil
}
