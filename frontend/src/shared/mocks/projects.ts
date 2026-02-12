import { Project } from "@/shared/types";

// Моковые проекты для разработки без бэкенда
export const mockProjects: Project[] = [
  {
    id: "1",
    name: "TeamFlow",
    description: "Платформа для управления задачами внутри команд",
    taskCount: 12,
    createdAt: "2025-12-01",
  },
  {
    id: "2",
    name: "Маркетинговый сайт",
    description: "Лендинг и блог компании",
    taskCount: 8,
    createdAt: "2025-12-10",
  },
  {
    id: "3",
    name: "Мобильное приложение",
    description: "iOS и Android клиент для TeamFlow",
    taskCount: 24,
    createdAt: "2026-01-05",
  },
  {
    id: "4",
    name: "Аналитика",
    description: "Дашборды и отчёты по продуктивности команд",
    taskCount: 6,
    createdAt: "2026-01-15",
  },
  {
    id: "5",
    name: "API v2",
    description: "Рефакторинг REST API, переход на новую версию",
    taskCount: 15,
    createdAt: "2026-02-01",
  },
];