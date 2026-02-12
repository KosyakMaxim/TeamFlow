"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useState } from "react";

type CreateTaskModalProps = {
  projectId: string;
  onSubmit: (task: Task) => void;
};

// Модалка создания новой задачи
export function CreateTaskModal({ projectId, onSubmit }: CreateTaskModalProps) {
  const [open, setOpen] = useState(false);

  // Состояние полей формы
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  // Состояние ошибки валидации
  const [error, setError] = useState("");

  // Сброс формы в начальное состояние
  function resetForm() {
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("medium");
    setError("");
  }

  // Обработка отправки формы
  function handleSubmit() {
    // Валидация: title не пустой и минимум 3 символа
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) {
      setError("Название должно содержать минимум 3 символа");
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      projectId,
      title: trimmedTitle,
      description: description.trim(),
      status,
      priority,
      assignee: "",
    };

    onSubmit(newTask);
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        // Сбрасываем форму при закрытии
        if (!value) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Новая задача
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать задачу</DialogTitle>
          <DialogDescription>Заполните поля для новой задачи</DialogDescription>
        </DialogHeader>

        {/* Форма */}
        <div className="space-y-4">
          {/* Название */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(""); // Сбрасываем ошибку при вводе
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

          {/* Статус и приоритет в одну строку */}
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>Создать</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
