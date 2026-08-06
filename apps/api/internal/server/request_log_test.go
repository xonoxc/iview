package server

import (
	"bytes"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func captureLogs(t *testing.T) *bytes.Buffer {
	t.Helper()

	var buf bytes.Buffer
	old := slog.Default()
	slog.SetDefault(slog.New(slog.NewTextHandler(&buf, nil)))
	t.Cleanup(func() { slog.SetDefault(old) })

	return &buf
}

func TestWithRequestLogging(t *testing.T) {
	buf := captureLogs(t)

	next := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusCreated)
		_, _ = w.Write([]byte("ok"))
	})

	ts := httptest.NewServer(withRequestLogging(next))
	defer ts.Close()

	req, err := http.NewRequest(http.MethodPost, ts.URL+"/api/v1/rooms", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("User-Agent", "test-agent")

	resp, err := ts.Client().Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()

	got := buf.String()
	for _, want := range []string{
		"http request",
		"method=POST",
		"path=/api/v1/rooms",
		"status=201",
		"user_agent=test-agent",
	} {
		if !strings.Contains(got, want) {
			t.Errorf("log output %q missing %q", got, want)
		}
	}
}

func TestWithRequestLoggingLevels(t *testing.T) {
	tests := []struct {
		name       string
		status     int
		wantLevel  string
	}{
		{name: "success logs at info", status: http.StatusOK, wantLevel: "INFO"},
		{name: "client error logs at warn", status: http.StatusBadRequest, wantLevel: "WARN"},
		{name: "server error logs at error", status: http.StatusInternalServerError, wantLevel: "ERROR"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			buf := captureLogs(t)

			next := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
				w.WriteHeader(tt.status)
			})

			ts := httptest.NewServer(withRequestLogging(next))
			defer ts.Close()

			resp, err := ts.Client().Get(ts.URL)
			if err != nil {
				t.Fatal(err)
			}
			defer resp.Body.Close()

			got := buf.String()
			if !strings.Contains(got, "level="+tt.wantLevel) {
				t.Errorf("log output %q missing level %q", got, tt.wantLevel)
			}
		})
	}
}
