package handlers

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	Success bool   `json:"success"`
	Data    any    `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

func writeJSON(w http.ResponseWriter, statusCode int, data any) {
	resp := Response{
		Success: true,
		Data:    data,
	}

	w.Header().Set("Content-type", "application/json")
	w.WriteHeader(statusCode)

	// we intentionall ignore the error here
	// if write fails, connection is probably closed and we can't do anything about it
	_ = json.NewEncoder(w).Encode(resp)
}

func decodeJSON[T any](w http.ResponseWriter, r *http.Request, dest *T) bool {
	defer r.Body.Close()

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	if err := dec.Decode(dest); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return false
	}

	return true
}

func writeError(w http.ResponseWriter, status int, message string) {
	res := Response{
		Success: false,
		Error:   message,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	_ = json.NewEncoder(w).Encode(res)
}
