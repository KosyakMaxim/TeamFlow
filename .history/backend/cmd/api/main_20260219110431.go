package main

import (
	"log"
	"net/http"

	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/handler"
	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/storage"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	// Инициализируем хранилище
	store := storage.NewMemoryStore()

	// Инициализируем handler-ы
	projectHandler := handler.NewProjectHandler(store)

	// Создаём роутер
	r := chi.NewRouter()

	// Middleware: логирование запросов и восстановление после panic
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})

	// API маршруты
	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/projects", func(r chi.Router) {
			r.Get("/", projectHandler.List)
			r.Post("/", projectHandler.Create)
			r.Get("/{id}", projectHandler.Get)
			r.Put("/{id}", projectHandler.Update)
			r.Delete("/{id}", projectHandler.Delete)
		})
	})

	// Запуск сервера
	log.Println("Сервер запущен на :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
