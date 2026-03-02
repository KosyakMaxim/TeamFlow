package handler

import (
	"encoding/json"
	"net/http"
)

// respondJSON — отправить JSON-ответ с указанным статусом
func respondJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

// respondError — отправить JSON-ошибку
func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}
