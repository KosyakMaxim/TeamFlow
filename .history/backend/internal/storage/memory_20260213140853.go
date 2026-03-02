package storage

import (
	"fmt"
	"sync"
	"time"

	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/models"
)

// MemoryStore — потокобезопасное хранилище проектов в памяти
type MemoryStore struct {
	mu       sync.RWMutex
	projects map[string]models.Project
	counter  int
}

// NewMemoryStore — конструктор хранилища
func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		projects: make(map[string]models.Project),
	}
}

// ListProjects — получить все проекты
func (s *MemoryStore) ListProjects() []models.Project {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]models.Project, 0, len(s.projects))
	for _, p := range s.projects {
		result = append(result, p)
	}
	return result
}

// GetProject — получить проект по ID
func (s *MemoryStore) GetProject(id string) (models.Project, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	p, ok := s.projects[id]
	if !ok {
		return models.Project{}, fmt.Errorf("проект с id %s не найден", id)
	}
	return p, nil
}

// CreateProject — создать новый проект
func (s *MemoryStore) CreateProject(req models.CreateProjectRequest) models.Project {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.counter++
	now := time.Now()
	p := models.Project{
		ID:          fmt.Sprintf("proj_%d", s.counter),
		Name:        req.Name,
		Description: req.Description,
		CreatedAt:   now,
		UpdatedAt:   now,
	}
	s.projects[p.ID] = p
	return p
}

// UpdateProject — обновить существующий проект
func (s *MemoryStore) UpdateProject(id string, req models.UpdateProjectRequest) (models.Project, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	p, ok := s.projects[id]
	if !ok {
		return models.Project{}, fmt.Errorf("проект с id %s не найден", id)
	}

	p.Name = req.Name
	p.Description = req.Description
	p.UpdatedAt = time.Now()
	s.projects[id] = p
	return p, nil
}

// DeleteProject — удалить проект
func (s *MemoryStore) DeleteProject(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.projects[id]; !ok {
		return fmt.Errorf("проект с id %s не найден", id)
	}
	delete(s.projects, id)
	return nil
}
