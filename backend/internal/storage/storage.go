package storage

import (
	"context"

	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/models"
)

// ProjectStore — интерфейс хранилища проектов
type ProjectStore interface {
	ListProjects(ctx context.Context) ([]models.Project, error)
	GetProject(ctx context.Context, id string) (models.Project, error)
	CreateProject(ctx context.Context, req models.CreateProjectRequest) (models.Project, error)
	UpdateProject(ctx context.Context, id string, req models.UpdateProjectRequest) (models.Project, error)
	DeleteProject(ctx context.Context, id string) error
}
