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
  TASK_PRIORITIES,
  TASK_STATUSES,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/shared/types";
import { useState } from "react";

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
  // Состояние полей формы
  const [error, setError] = useState("");
  const [title, setTitle] = useState(mode === "edit" && task ? task.title : "");
  const [description, setDescription] = useState(
    mode === "edit" && task ? task.description : "",
  );
  const [status, setStatus] = useState<TaskStatus>(
    mode === "edit" && task ? task.status : "todo",
  );
  const [priority, setPriority] = useState<TaskPriority>(
    mode === "edit" && task ? task.priority : "medium",
  );

  // Обработка отправки формы
  function handleSubmit() {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) {
      setError("Название должно содержать минимум 3 символа");
      return;
    }

    const result: Task = {
      // При редактировании сохраняем id, при создании — генерируем новый
      id: mode === "edit" ? task.id : crypto.randomUUID(),
      projectId,
      title: trimmedTitle,
      description: description.trim(),
      status,
      priority,
      assignee: mode === "edit" ? task.assignee : "",
    };

    onSubmit(result);
    onOpenChange(false);
  }

  const isEdit = mode === "edit";

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

        <div className="space-y-4">
          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              placeholder="Что нужно сделать?"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробности задачи..."
              rows={3}
            />
          </div>

          {/* Статус и приоритет */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Статус</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
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
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Сохранить" : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
