"use client";

import { CreateTaskModal } from "@/features/tasks/create-task-modal";
import { TaskFilters } from "@/features/tasks/task-filters";
import { TaskTable } from "@/features/tasks/task-table";
import { mockTasks } from "@/shared/mocks/tasks";
import { Task, TaskStatus } from "@/shared/types";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

// Страница задач проекта — соединяет компоненты и управляет стейтом
export default function ProjectTasksPage() {
  const { id } = useParams<{ id: string }>();

  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TaskStatus>("all");

  // Задачи текущего проекта
  const projectTasks = useMemo(
    () => tasks.filter((task) => task.projectId === id),
    [tasks, id]
  );

  // Фильтрация по статусу и поиску
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projectTasks
      .filter((task) => (status === "all" ? true : task.status === status))
      .filter((task) => task.title.toLowerCase().includes(query));
  }, [projectTasks, status, search]);

  function handleCreateTask(task: Task) {
    setTasks((prev) => [...prev, task]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Задачи проекта</h2>
          <p className="text-muted-foreground">Project ID: {id}</p>
        </div>
        <CreateTaskModal projectId={id} onSubmit={handleCreateTask} />
      </div>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <TaskTable tasks={filteredTasks} />
    </div>
  );
}
