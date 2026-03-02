package handler

import (
	"encoding/json"
	"net/http"

	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/models"
	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/storage"
	"github.com/go-chi/chi/v5"
)

// ProjectHandler — группа handler-ов для проектов
type ProjectHandler struct {
	store *storage.MemoryStore
}

// NewProjectHandler — конструктор
func NewProjectHandler(store *storage.MemoryStore) *ProjectHandler {
	return &ProjectHandler{store: store}
}

// List — GET /api/v1/projects
func (h *ProjectHandler) List(w http.ResponseWriter, r *http.Request) {
	projects := h.store.ListProjects()
	respondJSON(w, http.StatusOK, projects)
}

// Get — GET /api/v1/projects/{id}
func (h *ProjectHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	project, err := h.store.GetProject(id)
	if err != nil {
		respondError(w, http.StatusNotFound, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, project)
}

// Create — POST /api/v1/projects
func (h *ProjectHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.CreateProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "невалидный JSON")
		return
	}

	if req.Name == "" {
		respondError(w, http.StatusBadRequest, "поле name обязательно")
		return
	}

	project := h.store.CreateProject(req)
	respondJSON(w, http.StatusCreated, project)
}

// Update — PUT /api/v1/projects/{id}
func (h *ProjectHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var req models.UpdateProjectRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "невалидный JSON")
		return
	}

	if req.Name == "" {
		respondError(w, http.StatusBadRequest, "поле name обязательно")
		return
	}

	project, err := h.store.UpdateProject(id, req)
	if err != nil {
		respondError(w, http.StatusNotFound, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, project)
}

// Delete — DELETE /api/v1/projects/{id}
func (h *ProjectHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.store.DeleteProject(id); err != nil {
		respondError(w, http.StatusNotFound, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
