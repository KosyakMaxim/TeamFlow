-- +goose Up — этот блок выполняется при применении миграции (goose up)
CREATE TABLE projects (
    -- id: уникальный идентификатор, UUID генерируется автоматически функцией gen_random_uuid()
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- name: название проекта, обязательное поле (NOT NULL), максимум 255 символов
    name VARCHAR(255) NOT NULL,
    -- description: описание проекта, необязательное, по умолчанию пустая строка
    description TEXT DEFAULT '',
    -- created_at: дата создания, с часовым поясом, автоматически ставится текущее время
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- updated_at: дата обновления, аналогично created_at
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- +goose Down — этот блок выполняется при откате миграции (goose down)
-- Удаляем таблицу, IF EXISTS — не падать с ошибкой если таблицы уже нет
DROP TABLE IF EXISTS projects;
