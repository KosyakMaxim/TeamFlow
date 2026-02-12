"use client";

import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "@/shared/api/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Ключ кэша для задач проекта
function taskKeys(projectId: string) {
  return ["tasks", projectId] as const;
}

// Хук для получения задач проекта
export function useTasksQuery(projectId: string) {
  return useQuery({
    queryKey: taskKeys(projectId),
    queryFn: () => fetchTasks(projectId),
  });
}

// Хук для создания задачи
export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    // После успешного создания — инвалидируем кэш, чтобы список обновился
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys(projectId) });
    },
  });
}

// Хук для обновления задачи
export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys(projectId) });
    },
  });
}

// Хук для удаления задачи
export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys(projectId) });
    },
  });
}
