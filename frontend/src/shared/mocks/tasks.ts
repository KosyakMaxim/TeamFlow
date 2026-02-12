import { Task } from "@/shared/types";

// Моковые задачи для экрана проекта
export const mockTasks: Task[] = [
  {
    id: "t1",
    projectId: "1",
    title: "Сверстать страницу логина",
    status: "todo",
    priority: "high",
    assignee: "Maxim",
    description: "Создать форму логина с валидацией полей",
  },
  {
    id: "t2",
    projectId: "1",
    title: "Сделать API клиента",
    status: "in_progress",
    priority: "medium",
    assignee: "Alex",
    description: "Создать форму логина с валидацией полей",
  },
  {
    id: "t3",
    projectId: "1",
    title: "Подключить таблицу проектов",
    status: "done",
    priority: "low",
    assignee: "Kate",
    description: "Создать форму логина с валидацией полей",
  },
  {
    id: "t4",
    projectId: "2",
    title: "Добавить SEO мета-теги",
    status: "todo",
    priority: "medium",
    assignee: "Ivan",
    description: "Создать форму логина с валидацией полей",
  },
  {
    id: "t5",
    projectId: "2",
    title: "Настроить аналитику",
    status: "in_progress",
    priority: "high",
    assignee: "Maxim",
    description: "Создать форму логина с валидацией полей",
  },
  {
    id: "t6",
    projectId: "2",
    title: "Оптимизировать картинки",
    status: "done",
    priority: "low",
    assignee: "Olga",
    description: "Создать форму логина с валидацией полей",
  },
];
