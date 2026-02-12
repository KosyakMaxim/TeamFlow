// Проект
export type Project = {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  createdAt: string; // ISO-дата
};

// Статусы задач — единый источник правды
export const TASK_STATUSES = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
] as const;

// Приоритеты задач
export const TASK_PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

// Типы выводятся из констант — не нужно дублировать строки
export type TaskStatus = (typeof TASK_STATUSES)[number]["value"];
// результат: "todo" | "in_progress" | "done"

export type TaskPriority = (typeof TASK_PRIORITIES)[number]["value"];
// результат: "low" | "medium" | "high"

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
};
