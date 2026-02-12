"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Task,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TaskFormData,
  taskFormSchema,
} from "@/shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type TaskFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
} & (
  | { mode: "create"; task?: undefined; onSubmit: (task: Task) => void }
  | { mode: "edit"; task: Task; onSubmit: (task: Task) => void }
);

// Универсальная модалка для создания и редактирования задачи
export function TaskFormModal({
  open,
  onOpenChange,
  projectId,
  mode,
  task,
  onSubmit,
}: TaskFormModalProps) {
  const isEdit = mode === "edit";

  // React Hook Form с Zod-валидацией
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: isEdit ? task.title : "",
      description: isEdit ? task.description : "",
      status: isEdit ? task.status : "todo",
      priority: isEdit ? task.priority : "medium",
    },
  });

  // Обработка отправки формы — data уже провалидирована Zod-ом
  function onFormSubmit(data: TaskFormData) {
    const result: Task = {
      id: isEdit ? task.id : crypto.randomUUID(),
      projectId,
      title: data.title.trim(),
      description: data.description ?? "",
      status: data.status,
      priority: data.priority,
      assignee: isEdit ? task.assignee : "",
    };

    onSubmit(result);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Редактировать задачу" : "Создать задачу"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Измените поля и сохраните"
              : "Заполните поля для новой задачи"}
          </DialogDescription>
        </DialogHeader>

        {/* form + handleSubmit — RHF перехватывает сабмит и валидирует */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              placeholder="Что нужно сделать?"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Подробности задачи..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Статус и приоритет */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <select
                id="status"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                {...register("status")}
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Приоритет</Label>
              <select
                id="priority"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                {...register("priority")}
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">{isEdit ? "Сохранить" : "Создать"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
