# План обучения: React + Go через создание SaaS (TeamFlow)

## Цель
За 12 недель (1–2 часа в день, 6 дней в неделю) собрать полноценное fullstack-приложение, которое можно положить в портфолио.

В результате:
- Next.js (App Router) + TypeScript
- React с продуманной архитектурой
- Go REST API
- PostgreSQL
- JWT авторизация
- Docker + docker-compose
- README с архитектурой и инструкцией запуска

---

# Итоговый проект: TeamFlow

SaaS-платформа для управления задачами внутри команд. Упрощённый аналог Linear/Jira.

## Сущности и связи

```
User (1) → (N) OrganizationMember → (1) Organization
Organization (1) → (N) Project
Project (1) → (N) Task
Task → assignee (User), creator (User)
OrganizationMember → role: "owner" | "member"
AuditLog → кто, что, когда сделал
```

## Страницы фронтенда

1. `/login`, `/register` — авторизация
2. `/dashboard` — список организаций пользователя
3. `/org/:id` — страница организации (проекты + участники)
4. `/org/:id/project/:pid` — канбан/список задач
5. `/org/:id/settings` — управление участниками, роли
6. `/profile` — настройки пользователя

## API endpoints (~20 штук)

- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`
- CRUD `/organizations`, `/organizations/:id/members`
- CRUD `/organizations/:id/projects`
- CRUD `/projects/:id/tasks` с фильтрацией, пагинацией, поиском
- `GET /projects/:id/audit-log`

---

# Стек технологий

## Frontend

| Что | Технология | Почему |
|---|---|---|
| Фреймворк | Next.js 14+ (App Router) | SSR, Server Components, file-based routing |
| Язык | TypeScript (strict) | типобезопасность |
| Стили | Tailwind CSS + shadcn/ui | быстрая стилизация + готовые компоненты |
| Состояние (клиент) | Zustand | легковесный, без бойлерплейта |
| Серверное состояние | TanStack Query v5 | кэширование, invalidation, optimistic updates |
| Формы | React Hook Form + Zod | валидация на схемах |
| HTTP-клиент | ky | лёгкий, поддерживает interceptors |
| Иконки | Lucide React | идут в комплекте с shadcn |

## Backend

| Что | Технология | Почему |
|---|---|---|
| Язык | Go 1.22+ | |
| Роутер | chi v5 | легковесный, idiomatic middleware |
| БД-драйвер | pgx v5 | быстрый, чистый PostgreSQL-драйвер |
| Миграции | goose | простой, SQL-файлы |
| JWT | golang-jwt/jwt v5 | стандарт |
| Хэширование | bcrypt (golang.org/x/crypto) | |
| Логирование | slog (stdlib Go 1.21+) | встроенный structured logger |
| Валидация | go-playground/validator | struct tags |
| Конфиг | env vars + .env (godotenv) | |

## Инфраструктура

| Что | Технология |
|---|---|
| БД | PostgreSQL 16 (Docker) |
| Контейнеры | Docker + docker-compose |
| Деплой | Render.com (бесплатный tier) |

---

# Режим дня

1–2 часа:
- 10 минут теория
- 60–90 минут код
- 10 минут фиксация выводов

---

# Сжатый план: 24 дня вместо 72

Дни 1–2 покрывают всю Неделю 1 оригинального плана (по 3 старых дня за 1 новый).
Дальнейшие дни объединяют связанные темы для эффективного прохождения.

---

# Фаза 1 — Frontend на моках (Дни 1–5)

## ✅ День 1 — Инициализация + Layout + Страница проектов
- `npx create-next-app@latest` с TypeScript, Tailwind, App Router, src/
- Структура папок: `src/app/`, `src/features/`, `src/shared/ui/`, `src/shared/lib/`
- shadcn/ui init + компоненты button, card, separator, avatar, sheet, tooltip
- Корневой `layout.tsx` с шрифтом Inter
- Sidebar + Topbar, группа маршрутов `(dashboard)/layout.tsx`
- Адаптивность: sidebar скрывается на мобильных, hamburger-меню (Sheet)
- Мок-данные проектов, компоненты `ProjectCard`, `ProjectList`
- Страница `/dashboard` — рендер карточек

Теория: App Router (Routing, Layouts), Tailwind responsive, props, children, key

---

## ✅ День 2 — Задачи: CRUD + фильтры + рефакторинг
- Мок-данные задач, типы `Task`, `TaskStatus`, `TaskPriority`
- Страница `/project/[id]` — таблица задач с фильтром по статусу и поиском
- Модалка создания задачи (shadcn Dialog), валидация title min 3 символа
- Добавление задачи в локальный стейт
- Рефакторинг: вынести `TaskFilters`, `TaskTable`, `CreateTaskModal` в `src/features/tasks/`
- Константы `TASK_STATUSES`, `TASK_PRIORITIES` — единый источник правды

Теория: useState, controlled inputs, .filter(), декомпозиция компонентов

---

## День 3 — Редактирование + удаление задач
- Клик по задаче → модалка с предзаполненными полями
- Переиспользовать `CreateTaskModal` → `TaskFormModal` с prop `mode: "create" | "edit"`
- Сохранение обновляет массив задач в стейте
- Кнопка удаления на строке задачи
- shadcn AlertDialog для подтверждения «Удалить задачу?»
- Удаление из локального стейта

---

## День 4 — React Hook Form + Zod + Zustand
- Установить `react-hook-form` + `zod` + `@hookform/resolvers`
- Переписать `TaskFormModal` на React Hook Form
- Zod-схема: `title: z.string().min(3).max(100)`, `priority: z.enum([...])` и т.д.
- Показ ошибок валидации под полями
- Установить zustand
- Создать `src/features/tasks/store.ts` — `useTaskStore` (tasks, addTask, updateTask, deleteTask, filters)
- Перевести все компоненты задач на стор вместо useState

Теория: RHF Quick Start, Zod, Zustand — store, selectors

---

## День 5 — TanStack Query + fake API + страница auth UI
- Установить `@tanstack/react-query`
- Создать `src/shared/api/tasks.ts` — функции с `setTimeout` (моки с задержкой 300ms)
- `useQuery` для получения задач, `useMutation` для create/update/delete
- `QueryClientProvider` в layout
- Loading-состояния (Skeleton из shadcn)
- Страница логина/регистрации — UI only (форма + валидация Zod, без реальной логики)
- Проверить весь флоу: навигация → проекты → задачи → CRUD

**Итог фазы:** полностью работающий фронтенд на моках

Теория: TanStack Query — Quick Start, Mutations, Query Invalidation

---

# Фаза 2 — Go Backend (Дни 6–9)

## День 6 — Go: HTTP сервер + chi + in-memory CRUD
- `go mod init github.com/<you>/teamflow-api`
- `cmd/api/main.go` — HTTP сервер, `GET /health` → `{"status": "ok"}`
- Подключить chi v5, middleware Logger, Recoverer
- Struct `Project` в `internal/models/project.go`
- In-memory хранилище (map + mutex) в `internal/storage/memory.go`
- Полный CRUD: `GET/POST /api/v1/projects`, `GET/PUT/DELETE /api/v1/projects/{id}`
- Вынести handler-ы в `internal/handler/project.go`
- Response helpers: `respondJSON()`, `respondError()`

Теория: Tour of Go, net/http, encoding/json, sync.Mutex, chi

---

## День 7 — PostgreSQL + Docker + миграции + CRUD через БД
- `docker-compose.yml` — PostgreSQL 16 + volume
- Установить goose, первая миграция: `CREATE TABLE projects (...)`
- Установить pgx/v5, подключиться к БД
- `internal/storage/postgres/project.go` — реализация через pgx
- Интерфейс `ProjectStore` → подменяемое хранилище
- Переключить handler-ы на postgres

Теория: pgx, SQL basics, goose миграции

---

## День 8 — Users + регистрация + логин + JWT
- Миграция: `CREATE TABLE users (id UUID, email UNIQUE, password_hash, name, ...)`
- `internal/models/user.go`, `internal/storage/postgres/user.go`
- `POST /api/v1/auth/register` — валидация, bcrypt, сохранение
- `POST /api/v1/auth/login` — проверка email + bcrypt compare
- Генерация JWT (access 15 мин, refresh 7 дней)

Теория: JWT — access + refresh, bcrypt

---

## День 9 — Auth middleware + связка с фронтом
- `internal/middleware/auth.go` — Bearer token → parse JWT → user_id в context
- Защитить `/api/v1/` кроме `/auth/*`
- Helper `UserFromContext(ctx)`
- Миграция: `owner_id` в projects, привязать к пользователю
- CORS middleware
- На фронте: заменить fake API на реальные запросы к `localhost:8080`
- Логин/регистрация на фронте — хранить токен, отправлять в headers
- Проверить: регистрация → логин → создание проекта → список

**Итог фазы:** fullstack работает end-to-end

---

# Фаза 3 — Задачи и организации (Дни 10–13)

## День 10 — Tasks backend: CRUD + пагинация + фильтрация
- Миграция: `tasks (id, project_id, title, description, status, priority, assignee_id, creator_id, created_at, updated_at)`
- CRUD endpoints: `/api/v1/projects/:id/tasks`
- Query params: `?page=1&limit=20&status=todo&priority=high&search=...`
- SQL: `WHERE ... ORDER BY created_at DESC LIMIT $1 OFFSET $2`
- Response: `{ data: [...], total: 123, page: 1, limit: 20 }`

---

## День 11 — Фронт на реальном API + SSR + protected routes
- Заменить моки TanStack Query на реальные запросы
- Пагинация + фильтры через query params
- Страницу проектов → Server Component (async fetch на сервере)
- `loading.tsx`, `error.tsx` для маршрутов
- `<Suspense>` для серверных компонентов
- Toast-уведомления (shadcn Sonner)
- Next.js middleware — проверка токена, редирект на `/login`
- `(auth)/layout.tsx` — отдельный layout без sidebar

Теория: Server Components, Streaming, Suspense

---

## День 12 — Организации (backend + frontend)
- Миграции: `organizations`, `org_members`
- CRUD `/api/v1/organizations`
- `projects.organization_id` — привязка проектов к org
- `GET /api/v1/organizations/:id/projects` с проверкой членства
- Фронт: `/org/:id` — проекты организации + участники
- `POST /api/v1/organizations/:id/invite` — приглашение по email
- UI: форма приглашения на странице настроек

---

## День 13 — Роли + тесты Go
- Роли: owner (приглашать, удалять участников, удалять org) / member (CRUD задач и проектов)
- `RequireRole("owner")` middleware/helper на бэкенде
- Скрытие кнопок на фронте для member
- 3–4 unit-теста: register, login, create project (httptest)
- Привести в порядок структуру `internal/`

---

# Фаза 4 — Production-качество (Дни 14–17)

## День 14 — Production Go: logging, shutdown, аудит-лог
- slog: structured logging, JSON в prod, text в dev
- Логирование запросов (middleware), ошибок, авторизации
- Graceful shutdown: `signal.NotifyContext`, `server.Shutdown(ctx)`
- Передача `ctx` через всю цепочку до БД
- Аудит-лог: таблица `audit_log`, логирование действий
- `GET /api/v1/organizations/:id/audit-log`
- Горутины для фоновой записи аудит-логов + WaitGroup

Теория: slog, goroutines, channels, WaitGroup

---

## День 15 — Production Go: валидация + error handling + индексы
- Единый формат ошибок: `{ "error": { "code": "...", "message": "...", "details": [...] } }`
- `go-playground/validator` для struct-ов
- Custom error types: `NotFoundError`, `ForbiddenError` → HTTP-коды
- Индексы: `tasks(project_id)`, `tasks(status)`, `org_members(user_id)`, `users(email)`
- Проверить goose up/down

---

## День 16 — Production фронт: optimistic updates + канбан D&D
- TanStack Query `onMutate` — обновление кэша до ответа сервера
- Откат при ошибке через `onError` + `previousData`
- Применить к: создание задачи, смена статуса, удаление
- `@dnd-kit/core` — три колонки: Todo, In Progress, Done
- Перетаскивание → `PATCH /tasks/:id` + optimistic update

---

## День 17 — Адаптивность + тёмная тема + accessibility
- Проверить все страницы на мобильном разрешении
- `next-themes` для dark mode, переключатель в topbar
- aria-labels, фокус на модалках, tab-навигация
- Lazy-loading: `next/dynamic` для канбана
- `next/image` для аватарок
- Прогнать полный флоу, починить баги

---

# Фаза 5 — Docker + доп. фичи (Дни 18–20)

## День 18 — Docker: Dockerfile API + web + compose
- Multi-stage Dockerfile для Go API (builder → scratch/alpine)
- Multi-stage Dockerfile для Next.js (standalone)
- `docker-compose.yml`: api, web, db + volumes + healthcheck
- `.env.example`, `.dockerignore`, `.gitignore`
- `docker-compose up` поднимает всё

---

## День 19 — CI + seed + тесты
- Ещё 3–4 теста Go (tasks CRUD, auth middleware)
- `go vet`, `go test ./...`
- Линтинг фронта: `npm run lint`
- `seed.sql` — тестовые данные
- Миграции при старте API (goose embed)
- `docker-compose up` → приложение сразу с данными

---

## День 20 — Доп. фичи: профиль, dashboard, refresh, rate limit, notifications
- `GET/PATCH /api/v1/users/me`, страница `/profile`
- Dashboard со статистикой (COUNT + GROUP BY)
- `POST /auth/refresh` + interceptor на фронте (401 → refresh → retry)
- Rate limiting на `/auth/*` — 10 req/min
- In-app notifications: таблица, badge в topbar, dropdown
- Общий рефакторинг: убрать дублирование, мёртвый код

---

# Фаза 6 — Документация, деплой, полировка (Дни 21–24)

## День 21 — Документация: README + API docs + ER-диаграмма
- README: описание, скриншоты, архитектура (mermaid), стек, команды запуска
- API-документация: таблица endpoints, примеры запросов/ответов, коды ошибок
- ER-диаграмма (mermaid или dbdiagram.io)

---

## День 22 — Деплой: Render + Vercel
- Render.com: Web Service для Go API + PostgreSQL (free tier)
- Healthcheck, миграции при старте
- Vercel для Next.js, `NEXT_PUBLIC_API_URL` на production
- CORS для production домена
- Прогнать полный флоу на production URL

---

## День 23 — Полировка: баги, performance, security
- Edge cases: пустые списки, длинные названия, невалидные UUID
- Network tab: нет лишних запросов
- Lighthouse: score > 80
- Security: parameterized queries, XSS, CORS, JWT секрет, bcrypt

---

## День 24 — Финал: тесты, git, итоговый прогон
- Довести тесты Go до 8–10 на ключевые handler-ы
- `docker-compose up` с нуля за 1 команду
- `.gitignore`: нет `.env`, `node_modules`, бинарников
- Чистые коммит-сообщения, репозиторий на GitHub
- Клонировать в новую папку → `docker-compose up` → всё работает
- **Проект завершён**

---

# Итог

В репозитории:
- Fullstack SaaS (TeamFlow)
- React + Next.js production app
- Go REST API
- PostgreSQL
- JWT авторизация (access + refresh)
- Docker + docker-compose
- Документированная архитектура
- Деплой на Render + Vercel

Проект готов к использованию в резюме как полноценный инженерный кейс.
