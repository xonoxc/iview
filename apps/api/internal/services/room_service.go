package services

import (
	"context"

	"github.com/xonoxc/iview/apps/api/internal/domain"
	"github.com/xonoxc/iview/apps/api/internal/repositories/room"
)

type RoomService struct {
	repo room.RoomRepo
}

func NewRoomService(repo room.RoomRepo) *RoomService {
	return &RoomService{
		repo: repo,
	}
}

func (s *RoomService) CreateRoom(ctx context.Context, room *domain.Room) error {
	if err := s.repo.Create(ctx, room); err != nil {
		return err
	}

	return nil
}

func (s *RoomService) GetRoomByID(ctx context.Context, id string) (*domain.Room, error) {
	room, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return room, nil
}
