"use client";

import { Button } from "@/components/ui/button";
import { DeleteTaskDialog } from "@/features/tasks/delete-task-dialog";
import { useTaskStore } from "@/features/tasks/store";
import { TaskFilters } from "@/features/tasks/task-filters";
import { TaskFormModal } from "@/features/tasks/task-form-modal";
import { TaskTable } from "@/features/tasks/task-table";
import { Task } from "@/shared/types";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ProjectTasksPage() {
  const { id } = useParams<{ id: string }>();

  // Данные и actions из стора
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTaskFromStore = useTaskStore((s) => s.deleteTask);
  const setSearch = useTaskStore((s) => s.setSearch);
  const setStatusFilter = useTaskStore((s) => s.setStatusFilter);

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

  // Фильтрация задач текущего проекта
  const filteredTasks = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return tasks
      .filter((t) => t.projectId === id)
      .filter((t) =>
        filters.status === "all" ? true : t.status === filters.status,
      )
      .filter((t) => t.title.toLowerCase().includes(query));
  }, [tasks, filters, id]);

  const formKey = formModal.open
    ? formModal.mode === "edit"
      ? `edit-${formModal.task.id}`
      : "create"
    : "closed";

  const formProps =
    formModal.open && formModal.mode === "edit"
      ? {
          mode: "edit" as const,
          task: formModal.task,
          onSubmit: updateTask,
        }
      : { mode: "create" as const, onSubmit: addTask };

  function handleDeleteTask() {
    if (!deleteDialog.open) return;
    deleteTaskFromStore(deleteDialog.task.id);
    setDeleteDialog({ open: false });
  }

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
        search={filters.search}
        onSearchChange={setSearch}
        status={filters.status}
        onStatusChange={setStatusFilter}
      />

      <TaskTable
        tasks={filteredTasks}
        onEdit={(task) => setFormModal({ open: true, mode: "edit", task })}
        onDelete={(task) => setDeleteDialog({ open: true, task })}
      />

      <TaskFormModal
        key={formKey}
        open={formModal.open}
        onOpenChange={(open) => {
          if (!open) setFormModal({ open: false });
        }}
        projectId={id}
        {...formProps}
      />

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
