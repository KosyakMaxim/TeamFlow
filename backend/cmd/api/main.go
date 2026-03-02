package main // точка входа в программу

import (
	"context"  // для создания контекста при подключении к БД
	"log"      // логирование (log.Println, log.Fatal)
	"net/http" // HTTP-сервер
	"os"       // чтение переменных окружения (os.Getenv)

	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/handler"          // наши обработчики запросов
	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/storage/postgres" // хранилище PostgreSQL
	"github.com/go-chi/chi/v5"                                               // HTTP-роутер
	"github.com/go-chi/chi/v5/middleware"                                    // встроенные middleware chi
	"github.com/jackc/pgx/v5/pgxpool"                                        // пул соединений PostgreSQL
)

func main() { // главная функция — запускается при старте программы

	// Читаем строку подключения к БД из переменной окружения DATABASE_URL
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" { // если переменная не задана — используем дефолт для разработки
		databaseURL = "postgresql://teamflow:teamflow_secret@localhost:5432/teamflow?sslmode=disable"
	}

	// context.Background() — пустой «корневой» контекст (без таймаута, без отмены)
	// pgxpool.New создаёт пул соединений к PostgreSQL (по умолчанию ~4 соединения)
	pool, err := pgxpool.New(context.Background(), databaseURL)
	if err != nil { // не удалось создать пул (например, невалидная строка подключения)
		log.Fatalf("Не удалось подключиться к БД: %v", err) // Fatal = логирует и завершает программу
	}
	defer pool.Close() // при завершении main() закроет все соединения пула

	// Ping отправляет простой запрос к БД, чтобы проверить что она доступна
	if err := pool.Ping(context.Background()); err != nil {
		log.Fatalf("БД не отвечает: %v", err) // если БД недоступна — падаем сразу, а не при первом запросе
	}
	log.Println("Подключено к PostgreSQL") // подтверждаем успешное подключение

	// Создаём хранилище PostgreSQL, передаём ему пул соединений
	store := postgres.NewProjectStore(pool)
	// Создаём обработчик проектов, передаём ему хранилище (интерфейс ProjectStore)
	projectHandler := handler.NewProjectHandler(store)

	// Создаём роутер chi
	r := chi.NewRouter()

	// Logger — middleware, логирует каждый входящий HTTP-запрос (метод, URL, время, статус)
	r.Use(middleware.Logger)
	// Recoverer — middleware, перехватывает panic в handler-ах и возвращает 500 вместо краша
	r.Use(middleware.Recoverer)

	// Эндпоинт проверки здоровья сервера
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json") // говорим клиенту что ответ — JSON
		w.Write([]byte(`{"status":"ok"}`))                 // пишем JSON-строку в ответ
	})

	// Группа маршрутов /api/v1
	r.Route("/api/v1", func(r chi.Router) {
		// Вложенная группа /api/v1/projects
		r.Route("/projects", func(r chi.Router) {
			r.Get("/", projectHandler.List)          // GET    /api/v1/projects      — список
			r.Post("/", projectHandler.Create)       // POST   /api/v1/projects      — создать
			r.Get("/{id}", projectHandler.Get)       // GET    /api/v1/projects/{id} — получить один
			r.Put("/{id}", projectHandler.Update)    // PUT    /api/v1/projects/{id} — обновить
			r.Delete("/{id}", projectHandler.Delete) // DELETE /api/v1/projects/{id} — удалить
		})
	})

	// Запускаем HTTP-сервер на порту 8080
	log.Println("Сервер запущен на :8080")
	// ListenAndServe блокирует выполнение — программа будет слушать запросы бесконечно
	// r — наш роутер, который обрабатывает все входящие запросы
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err) // если сервер не смог стартовать (например, порт занят)
	}
}
