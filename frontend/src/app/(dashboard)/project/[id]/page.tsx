"use client";

import { Button } from "@/components/ui/button";
import { DeleteTaskDialog } from "@/features/tasks/delete-task-dialog";
import { TaskFilters } from "@/features/tasks/task-filters";
import { TaskFormModal } from "@/features/tasks/task-form-modal";
import { TaskTable } from "@/features/tasks/task-table";
import { mockTasks } from "@/shared/mocks/tasks";
import { Task, TaskStatus } from "@/shared/types";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

// Страница задач проекта — соединяет компоненты и управляет стейтом
export default function ProjectTasksPage() {
  const { id } = useParams<{ id: string }>();

  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TaskStatus>("all");

  // Состояние модалки формы задачи
  const [formModal, setFormModal] = useState<
    | { open: false }
    | { open: true; mode: "create" }
    | { open: true; mode: "edit"; task: Task }
  >({ open: false });

  // Состояние диалога удаления
  const [deleteDialog, setDeleteDialog] = useState<
    { open: false } | { open: true; task: Task }
  >({ open: false });

  // Задачи текущего проекта
  const projectTasks = useMemo(
    () => tasks.filter((task) => task.projectId === id),
    [tasks, id],
  );

  // Фильтрация по статусу и поиску
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projectTasks
      .filter((task) => (status === "all" ? true : task.status === status))
      .filter((task) => task.title.toLowerCase().includes(query));
  }, [projectTasks, status, search]);

  // Создание задачи — добавляем в массив
  function handleCreateTask(task: Task) {
    setTasks((prev) => [...prev, task]);
  }

  const formKey = formModal.open
    ? formModal.mode === "edit"
      ? `edit-${formModal.task.id}`
      : "create"
    : "closed";

  // Обновление задачи — заменяем по id
  function handleUpdateTask(updated: Task) {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  // Удаление задачи — убираем из массива по id
  function handleDeleteTask() {
    if (!deleteDialog.open) return;
    setTasks((prev) => prev.filter((t) => t.id !== deleteDialog.task.id));
    setDeleteDialog({ open: false });
  }

  // Собираем пропы формы в один объект, и TypeScript корректно сужает union
  const formProps =
    formModal.open && formModal.mode === "edit"
      ? {
          mode: "edit" as const,
          task: formModal.task,
          onSubmit: handleUpdateTask,
        }
      : { mode: "create" as const, onSubmit: handleCreateTask };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Задачи проекта</h2>
          <p className="text-muted-foreground">Project ID: {id}</p>
        </div>
        <Button
          size="sm"
          onClick={() => setFormModal({ open: true, mode: "create" })}
        >
          <Plus className="size-4" />
          Новая задача
        </Button>
      </div>

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <TaskTable
        tasks={filteredTasks}
        onEdit={(task) => setFormModal({ open: true, mode: "edit", task })}
        onDelete={(task) => setDeleteDialog({ open: true, task })}
      />

      {/* Модалка создания/редактирования */}
      <TaskFormModal
        key={formKey}
        open={formModal.open}
        onOpenChange={(open) => {
          if (!open) setFormModal({ open: false });
        }}
        projectId={id}
        {...formProps}
      />

      {/* Диалог подтверждения удаления */}
      <DeleteTaskDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) setDeleteDialog({ open: false });
        }}
        taskTitle={deleteDialog.open ? deleteDialog.task.title : ""}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}
