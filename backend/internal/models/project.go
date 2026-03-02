package models

import "time"

// Project — сущность проекта
type Project struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateProjectRequest — тело запроса на создание проекта
type CreateProjectRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

// UpdateProjectRequest — тело запроса на обновление проекта
type UpdateProjectRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}
