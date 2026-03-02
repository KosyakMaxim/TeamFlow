# TeamFlow (React + Go Fullstack)

Учебный fullstack-проект: SaaS-платформа для управления задачами в командах (упрощённый аналог Linear/Jira).  
Проект делается по поэтапному плану на 24 учебных дня.

## Что это за проект

TeamFlow — приложение для командной работы с проектами и задачами:
- управление проектами;
- дальнейшее развитие в сторону задач, организаций, ролей и аудита;
- связка frontend + backend + PostgreSQL в контейнерах.

Основная цель репозитория — собрать production-ориентированный кейс для портфолио, проходя весь путь: от UI на моках до полноценного деплоя.

## Стек

### Frontend (`/frontend`)
- Next.js (App Router), React, TypeScript
- Tailwind CSS, shadcn/ui, Lucide
- Zustand
- TanStack Query
- React Hook Form + Zod

### Backend (`/backend`)
- Go
- chi v5
- pgx/v5
- PostgreSQL
- goose (SQL-миграции)

### Инфраструктура
- Docker + Docker Compose

## Текущий прогресс

По учебному плану на сегодня завершён **День 7**.

### Уже сделано (Дни 1–7)

**Фаза 1 — Frontend на моках (Дни 1–5):**
- инициализирован frontend на Next.js + TypeScript + Tailwind;
- собран базовый UI (layout, sidebar/topbar, страницы dashboard/project);
- реализован CRUD задач на моках, фильтры и поиск;
- добавлены RHF + Zod, Zustand, TanStack Query.

**Фаза 2 — Backend (Дни 6–7):**
- поднят HTTP API на Go + chi;
- реализован CRUD проектов;
- добавлено in-memory хранилище и переход на интерфейс `ProjectStore`;
- подключён PostgreSQL через `pgxpool`;
- добавлена миграция `projects`;
- реализовано хранилище проектов в PostgreSQL;
- настроен `docker-compose.yml` для БД.

## Что планируется дальше

### Ближайшие шаги (Дни 8–9)
- Users: регистрация, логин, bcrypt;
- JWT (access/refresh);
- auth middleware и защита `/api/v1/*`;
- связка frontend с реальным API.

### Следующие этапы (Дни 10–24)
- задачи и организации (CRUD, роли, пагинация/фильтрация);
- production-улучшения backend (логирование, graceful shutdown, единые ошибки, индексы);
- production-улучшения frontend (optimistic updates, kanban D&D, адаптивность, dark mode, a11y);
- контейнеризация всего стека (api + web + db), CI, seed;
- документация, деплой (Render + Vercel), финальная полировка.

Подробный поэтапный план: `react_go_fullstack_study_plan.md`.

## Как запустить текущее состояние проекта

### 1) Запустить PostgreSQL
```bash
docker compose up -d db
```

### 2) Применить миграции
```bash
cd backend
goose -dir migrations postgres "postgresql://teamflow:teamflow_secret@localhost:5432/teamflow?sslmode=disable" up
```

### 3) Запустить backend API
```bash
cd backend
go run ./cmd/api
```

API стартует на `http://localhost:8080`, health-check: `GET /health`.

### 4) Запустить frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:3000`.
