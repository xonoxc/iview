package server

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/xonoxc/iview/apps/api/internal/domain"
	"github.com/xonoxc/iview/apps/api/internal/handlers"
	"github.com/xonoxc/iview/apps/api/internal/repositories/room"
	"github.com/xonoxc/iview/apps/api/internal/router"
	"github.com/xonoxc/iview/apps/api/internal/services"
)

const testRoomID = "11111111-1111-1111-1111-111111111111"

type fakeRoomRepo struct{}

func (f *fakeRoomRepo) Create(_ context.Context, r *domain.Room) error {
	r.ID = testRoomID
	return nil
}

func (f *fakeRoomRepo) FindByID(_ context.Context, id string) (*domain.Room, error) {
	if id != testRoomID {
		return nil, room.ErrRoomNotFound
	}
	return &domain.Room{ID: id, Title: "Hello Room"}, nil
}

func (f *fakeRoomRepo) UpdateStatus(_ context.Context, _ string, _ domain.RoomStatus) error {
	return nil
}

func newTestServer(t *testing.T) *httptest.Server {
	t.Helper()

	roomService := services.NewRoomService(&fakeRoomRepo{})
	rt := router.NewRouter(router.Handlers{
		RoomHandler: handlers.NewRoomHandler(*roomService),
	})

	return httptest.NewServer(withCORS(rt.SetupRoutes()))
}

func noRedirectClient(ts *httptest.Server) *http.Client {
	client := ts.Client()
	client.CheckRedirect = func(_ *http.Request, _ []*http.Request) error {
		return http.ErrUseLastResponse
	}
	return client
}

func TestCreateRoom(t *testing.T) {
	ts := newTestServer(t)
	defer ts.Close()

	body, err := json.Marshal(map[string]string{"title": "Hello Room"})
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest(http.MethodPost, ts.URL+"/api/v1/rooms", bytes.NewReader(body))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "http://localhost:3000")

	resp, err := noRedirectClient(ts).Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		t.Errorf("status = %d, want %d (got redirected instead of serving the route?)", resp.StatusCode, http.StatusCreated)
	}

	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != "http://localhost:3000" {
		t.Errorf("Access-Control-Allow-Origin = %q, want %q", got, "http://localhost:3000")
	}
}

func TestGetRoom(t *testing.T) {
	ts := newTestServer(t)
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL + "/api/v1/rooms/" + testRoomID)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusOK)
	}
}

func TestGetRoomNotFound(t *testing.T) {
	ts := newTestServer(t)
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL + "/api/v1/rooms/22222222-2222-2222-2222-222222222222")
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusNotFound)
	}
}

func TestPreflightRequest(t *testing.T) {
	ts := newTestServer(t)
	defer ts.Close()

	req, err := http.NewRequest(http.MethodOptions, ts.URL+"/api/v1/rooms", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Origin", "http://localhost:3000")
	req.Header.Set("Access-Control-Request-Method", "POST")
	req.Header.Set("Access-Control-Request-Headers", "content-type")

	resp, err := ts.Client().Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusNoContent)
	}
	if got := resp.Header.Get("Access-Control-Allow-Origin"); got != "http://localhost:3000" {
		t.Errorf("Access-Control-Allow-Origin = %q, want %q", got, "http://localhost:3000")
	}
}
