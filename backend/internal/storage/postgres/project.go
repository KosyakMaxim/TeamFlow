package postgres // пакет для работы с PostgreSQL

import ( // импорты
	"context" // контекст запроса (таймауты, отмена операции)
	"fmt"     // форматирование строк и ошибок

	"github.com/KosyakMaxim/TeamFlow/teamflow-api/internal/models" // наши модели данных
	"github.com/jackc/pgx/v5/pgxpool"                              // пул соединений к PostgreSQL
)

// ProjectStore — структура, хранит пул соединений к БД
type ProjectStore struct {
	pool *pgxpool.Pool // пул: переиспользует соединения к БД (не открывает новое на каждый запрос)
}

// NewProjectStore — конструктор, принимает пул и возвращает хранилище
func NewProjectStore(pool *pgxpool.Pool) *ProjectStore {
	return &ProjectStore{pool: pool} // сохраняем пул в структуру
}

// ListProjects — получить все проекты из таблицы projects
func (s *ProjectStore) ListProjects(ctx context.Context) ([]models.Project, error) {
	// pool.Query выполняет SELECT и возвращает набор строк (rows)
	// ctx — контекст: если HTTP-запрос отменён, запрос к БД тоже отменится
	rows, err := s.pool.Query(ctx,
		`SELECT id, name, description, created_at, updated_at
		 FROM projects
		 ORDER BY created_at DESC`) // сортируем: новые проекты первыми
	if err != nil { // если ошибка при выполнении SQL
		return nil, fmt.Errorf("ListProjects: %w", err) // %w оборачивает ошибку (можно проверить через errors.Is)
	}
	defer rows.Close() // обязательно закрываем rows, иначе соединение не вернётся в пул

	var projects []models.Project // объявляем слайс для результатов (nil пока)
	for rows.Next() {             // перебираем строки результата по одной
		var p models.Project // переменная для одной строки
		// Scan читает значения колонок текущей строки в поля структуры
		// порядок полей должен совпадать с порядком колонок в SELECT
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, fmt.Errorf("ListProjects scan: %w", err) // ошибка чтения строки
		}
		projects = append(projects, p) // добавляем прочитанный проект в слайс
	}

	if projects == nil { // если в БД нет ни одного проекта
		projects = []models.Project{} // возвращаем пустой массив [], а не null в JSON
	}
	return projects, nil // возвращаем список проектов
}

// GetProject — получить один проект по UUID
func (s *ProjectStore) GetProject(ctx context.Context, id string) (models.Project, error) {
	var p models.Project // переменная для результата
	// QueryRow — выполнить запрос и вернуть ровно одну строку
	// $1 — плейсхолдер для первого параметра (id), защита от SQL-инъекций
	err := s.pool.QueryRow(ctx,
		`SELECT id, name, description, created_at, updated_at
		 FROM projects
		 WHERE id = $1`, id, // значение $1 = id
	).Scan(&p.ID, &p.Name, &p.Description, &p.CreatedAt, &p.UpdatedAt) // читаем результат в поля
	if err != nil { // если строка не найдена или другая ошибка
		return models.Project{}, fmt.Errorf("проект с id %s не найден", id)
	}
	return p, nil // проект найден
}

// CreateProject — вставить новый проект в БД и вернуть его
func (s *ProjectStore) CreateProject(ctx context.Context, req models.CreateProjectRequest) (models.Project, error) {
	var p models.Project // переменная для результата
	// INSERT вставляет новую строку
	// RETURNING — фишка PostgreSQL: возвращает вставленную строку (не нужен отдельный SELECT)
	// $1, $2 — параметры: name и description
	err := s.pool.QueryRow(ctx,
		`INSERT INTO projects (name, description)
		 VALUES ($1, $2)
		 RETURNING id, name, description, created_at, updated_at`,
		req.Name, req.Description, // значения для $1 и $2
	).Scan(&p.ID, &p.Name, &p.Description, &p.CreatedAt, &p.UpdatedAt) // читаем вставленную строку
	if err != nil { // ошибка вставки
		return models.Project{}, fmt.Errorf("CreateProject: %w", err)
	}
	return p, nil // возвращаем созданный проект (с UUID от БД)
}

// UpdateProject — обновить проект в БД
func (s *ProjectStore) UpdateProject(ctx context.Context, id string, req models.UpdateProjectRequest) (models.Project, error) {
	var p models.Project // переменная для результата
	// UPDATE обновляет строку по условию WHERE id = $3
	// SET — какие поля менять; updated_at = now() — обновляем дату
	// RETURNING — возвращаем обновлённую строку
	err := s.pool.QueryRow(ctx,
		`UPDATE projects
		 SET name = $1, description = $2, updated_at = now()
		 WHERE id = $3
		 RETURNING id, name, description, created_at, updated_at`,
		req.Name, req.Description, id, // $1 = name, $2 = description, $3 = id
	).Scan(&p.ID, &p.Name, &p.Description, &p.CreatedAt, &p.UpdatedAt) // читаем результат
	if err != nil { // строка не найдена или ошибка
		return models.Project{}, fmt.Errorf("проект с id %s не найден", id)
	}
	return p, nil // проект обновлён
}

// DeleteProject — удалить проект из БД
func (s *ProjectStore) DeleteProject(ctx context.Context, id string) error {
	// Exec выполняет запрос без возврата строк (DELETE, INSERT без RETURNING)
	// result содержит информацию о выполнении (сколько строк затронуто)
	result, err := s.pool.Exec(ctx,
		`DELETE FROM projects WHERE id = $1`, id) // удаляем строку по ID
	if err != nil { // ошибка выполнения SQL
		return fmt.Errorf("DeleteProject: %w", err)
	}
	if result.RowsAffected() == 0 { // ни одна строка не была удалена → проект не существует
		return fmt.Errorf("проект с id %s не найден", id)
	}
	return nil // успешно удалён
}
