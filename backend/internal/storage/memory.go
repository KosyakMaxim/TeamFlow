package storage // принадлежит пакету storage

import ( // импортируем нужные пакеты
	"context" // для context.Context — контекст запроса (таймауты, отмена)
	"fmt"     // для форматирования строк (Sprintf, Errorf)
	"sync"    // для мьютексов (потокобезопасный доступ)
	"time"    // для работы с датами (time.Now())

	// импортируем наши модели из пакета models
	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/models"
)

// MemoryStore — структура хранилища в памяти
type MemoryStore struct {
	mu       sync.RWMutex              // мьютекс: защищает map от одновременного чтения/записи
	projects map[string]models.Project // map (словарь): ключ — ID проекта, значение — сам проект
	counter  int                       // счётчик для генерации уникальных ID
}

// NewMemoryStore — функция-конструктор, создаёт и возвращает новый MemoryStore
func NewMemoryStore() *MemoryStore {
	return &MemoryStore{ // возвращаем указатель на новую структуру
		projects: make(map[string]models.Project), // инициализируем пустую map (без make будет nil → panic)
	}
}

// ListProjects — возвращает все проекты из хранилища
// _ context.Context — принимаем контекст, но не используем (подчёркивание = игнорируем)
// В memory контекст не нужен, но интерфейс его требует
func (s *MemoryStore) ListProjects(_ context.Context) ([]models.Project, error) {
	s.mu.RLock()         // блокируем на чтение (другие тоже могут читать, но писать нельзя)
	defer s.mu.RUnlock() // гарантированно разблокируем при выходе из функции

	// создаём слайс (динамический массив) с начальной длиной 0 и ёмкостью len(s.projects)
	result := make([]models.Project, 0, len(s.projects))
	for _, p := range s.projects { // перебираем все значения в map (_ = ключ, p = значение)
		result = append(result, p) // добавляем проект в результат
	}
	return result, nil // возвращаем список и nil (ошибки нет)
}

// GetProject — находит проект по ID, возвращает ошибку если не найден
func (s *MemoryStore) GetProject(_ context.Context, id string) (models.Project, error) {
	s.mu.RLock()         // блокируем на чтение
	defer s.mu.RUnlock() // разблокируем при выходе

	p, ok := s.projects[id] // пробуем достать проект из map; ok = true если ключ найден
	if !ok {                // если ключ не найден
		return models.Project{}, fmt.Errorf("проект с id %s не найден", id) // пустая структура + ошибка
	}
	return p, nil // проект найден, ошибки нет
}

// CreateProject — создаёт новый проект и возвращает его
func (s *MemoryStore) CreateProject(_ context.Context, req models.CreateProjectRequest) (models.Project, error) {
	s.mu.Lock()         // полная блокировка (чтение и запись запрещены другим горутинам)
	defer s.mu.Unlock() // разблокируем при выходе

	s.counter++          // увеличиваем счётчик на 1
	now := time.Now()    // запоминаем текущее время
	p := models.Project{ // создаём структуру проекта
		ID:          fmt.Sprintf("proj_%d", s.counter), // формируем ID: "proj_1", "proj_2", ...
		Name:        req.Name,                          // берём имя из запроса
		Description: req.Description,                   // берём описание из запроса
		CreatedAt:   now,                               // дата создания = сейчас
		UpdatedAt:   now,                               // дата обновления = сейчас
	}
	s.projects[p.ID] = p // сохраняем проект в map по ключу ID
	return p, nil        // возвращаем созданный проект
}

// UpdateProject — обновляет существующий проект
func (s *MemoryStore) UpdateProject(_ context.Context, id string, req models.UpdateProjectRequest) (models.Project, error) {
	s.mu.Lock()         // полная блокировка
	defer s.mu.Unlock() // разблокируем при выходе

	p, ok := s.projects[id] // ищем проект по ID
	if !ok {                // не нашли
		return models.Project{}, fmt.Errorf("проект с id %s не найден", id)
	}

	p.Name = req.Name               // обновляем имя
	p.Description = req.Description // обновляем описание
	p.UpdatedAt = time.Now()        // ставим новую дату обновления
	s.projects[id] = p              // перезаписываем проект в map (map хранит копии, не ссылки)
	return p, nil                   // возвращаем обновлённый проект
}

// DeleteProject — удаляет проект по ID
func (s *MemoryStore) DeleteProject(_ context.Context, id string) error {
	s.mu.Lock()         // полная блокировка
	defer s.mu.Unlock() // разблокируем при выходе

	if _, ok := s.projects[id]; !ok { // проверяем: есть ли проект с таким ID
		return fmt.Errorf("проект с id %s не найден", id) // нет — возвращаем ошибку
	}
	delete(s.projects, id) // встроенная функция Go: удаляет ключ из map
	return nil             // ошибки нет
}
