package testutils

import (
	"context"
	"testing"
	"time"
)

func TestNewPostgres(t *testing.T) {
	db := NewPostgres(t)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var exists bool
	if err := db.QueryRowContext(ctx,
		"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rooms')",
	).Scan(&exists); err != nil {
		t.Fatalf("query: %v", err)
	}

	if !exists {
		t.Fatal("rooms table not found after migrations")
	}
}
