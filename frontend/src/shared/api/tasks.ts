import { mockTasks } from "@/shared/mocks/tasks";
import { Task } from "@/shared/types";

// In-memory хранилище — имитирует базу данных на сервере
let tasks: Task[] = [...mockTasks];

// Хелпер для имитации задержки сети
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Получить задачи проекта
export async function fetchTasks(projectId: string): Promise<Task[]> {
  await delay();
  return tasks.filter((t) => t.projectId === projectId);
}

// Создать задачу
export async function createTask(task: Task): Promise<Task> {
  await delay();
  tasks = [...tasks, task];
  return task;
}

// Обновить задачу
export async function updateTask(updated: Task): Promise<Task> {
  await delay();
  tasks = tasks.map((t) => (t.id === updated.id ? updated : t));
  return updated;
}

// Удалить задачу
export async function deleteTask(id: string): Promise<void> {
  await delay();
  tasks = tasks.filter((t) => t.id !== id);
}
