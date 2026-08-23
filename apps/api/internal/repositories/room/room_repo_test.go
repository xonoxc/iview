package room

import (
	"context"
	"testing"
	"time"

	"github.com/xonoxc/iview/apps/api/internal/domain"
	"github.com/xonoxc/iview/apps/api/internal/testutils"
)

func TestPostgresRoomRepo(t *testing.T) {
	db := testutils.NewPostgres(t)
	repo := NewRoomRepo(db)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	t.Cleanup(cancel)

	room := &domain.Room{Title: "my room"}

	if err := repo.Create(ctx, room); err != nil {
		t.Fatalf("create: %v", err)
	}

	if room.ID == "" {
		t.Fatal("expected generated id")
	}

	if room.Status != domain.RoomWaiting {
		t.Fatalf("expected default status waiting, got %q", room.Status)
	}

	got, err := repo.FindByID(ctx, room.ID)
	if err != nil {
		t.Fatalf("find by id: %v", err)
	}

	if got.Title != room.Title {
		t.Fatalf("expected title %q, got %q", room.Title, got.Title)
	}

	if err := repo.UpdateStatus(ctx, room.ID, domain.RoomActive); err != nil {
		t.Fatalf("update status: %v", err)
	}

	got, err = repo.FindByID(ctx, room.ID)
	if err != nil {
		t.Fatalf("find by id after update: %v", err)
	}

	if got.Status != domain.RoomActive {
		t.Fatalf("expected status active, got %q", got.Status)
	}
}
