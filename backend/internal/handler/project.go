package handler // пакет handler — обработчики HTTP-запросов

import (
	"encoding/json" // кодирование/декодирование JSON
	"net/http"      // HTTP типы: ResponseWriter, Request, статус-коды

	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/models"  // наши модели (Project, CreateProjectRequest и т.д.)
	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/storage" // интерфейс ProjectStore
	"github.com/go-chi/chi/v5"                                      // роутер chi (для URLParam)
)

// ProjectHandler — структура с зависимостями для обработки запросов по проектам
type ProjectHandler struct {
	// БЫЛО: store *storage.MemoryStore  — жёсткая привязка к конкретному хранилищу
	// СТАЛО: store storage.ProjectStore — интерфейс, можно подставить любую реализацию
	store storage.ProjectStore
}

// NewProjectHandler — конструктор, принимает любое хранилище, реализующее ProjectStore
func NewProjectHandler(store storage.ProjectStore) *ProjectHandler {
	return &ProjectHandler{store: store} // сохраняем хранилище
}

// List — обработчик GET /api/v1/projects (получить все проекты)
func (h *ProjectHandler) List(w http.ResponseWriter, r *http.Request) {
	// r.Context() — контекст HTTP-запроса, передаём в store
	// если клиент отключится, контекст отменится и запрос к БД прервётся
	projects, err := h.store.ListProjects(r.Context())
	if err != nil { // ошибка получения списка
		respondError(w, http.StatusInternalServerError, err.Error()) // 500
		return                                                       // прекращаем выполнение
	}
	respondJSON(w, http.StatusOK, projects) // 200 + JSON массив проектов
}

// Get — обработчик GET /api/v1/projects/{id} (получить один проект)
func (h *ProjectHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id") // извлекаем {id} из URL, например "abc-123"

	project, err := h.store.GetProject(r.Context(), id) // ищем проект в хранилище
	if err != nil {                                     // проект не найден
		respondError(w, http.StatusNotFound, err.Error()) // 404
		return
	}
	respondJSON(w, http.StatusOK, project) // 200 + JSON объект проекта
}

// Create — обработчик POST /api/v1/projects (создать проект)
func (h *ProjectHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req models.CreateProjectRequest // переменная для данных из тела запроса
	// json.NewDecoder читает тело запроса (r.Body) и парсит JSON в структуру req
	// &req — передаём указатель, чтобы Decode мог записать данные в req
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "невалидный JSON") // 400 — клиент прислал мусор
		return
	}

	if req.Name == "" { // простая валидация: имя обязательно
		respondError(w, http.StatusBadRequest, "поле name обязательно") // 400
		return
	}

	project, err := h.store.CreateProject(r.Context(), req) // создаём проект в хранилище
	if err != nil {                                         // ошибка создания (например, проблема с БД)
		respondError(w, http.StatusInternalServerError, err.Error()) // 500
		return
	}
	respondJSON(w, http.StatusCreated, project) // 201 Created + JSON созданного проекта
}

// Update — обработчик PUT /api/v1/projects/{id} (обновить проект)
func (h *ProjectHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id") // достаём ID из URL

	var req models.UpdateProjectRequest                          // структура для данных обновления
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil { // парсим JSON
		respondError(w, http.StatusBadRequest, "невалидный JSON") // 400
		return
	}

	if req.Name == "" { // валидация
		respondError(w, http.StatusBadRequest, "поле name обязательно") // 400
		return
	}

	project, err := h.store.UpdateProject(r.Context(), id, req) // обновляем в хранилище
	if err != nil {                                             // проект не найден
		respondError(w, http.StatusNotFound, err.Error()) // 404
		return
	}
	respondJSON(w, http.StatusOK, project) // 200 + обновлённый проект
}

// Delete — обработчик DELETE /api/v1/projects/{id} (удалить проект)
func (h *ProjectHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id") // достаём ID из URL

	if err := h.store.DeleteProject(r.Context(), id); err != nil { // удаляем из хранилища
		respondError(w, http.StatusNotFound, err.Error()) // 404 — проект не найден
		return
	}
	w.WriteHeader(http.StatusNoContent) // 204 No Content — успешно удалён, тела ответа нет
}
