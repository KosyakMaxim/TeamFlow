import { Button } from "@/components/ui/button";
import { Task } from "@/shared/types";
import { Pencil, Trash2 } from "lucide-react";

type TaskTableProps = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

// Таблица задач с кнопками редактирования и удаления
export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full min-w-[700px] text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Название</th>
            <th className="px-4 py-2 text-left font-medium">Статус</th>
            <th className="px-4 py-2 text-left font-medium">Приоритет</th>
            <th className="px-4 py-2 text-left font-medium">Исполнитель</th>
            <th className="px-4 py-2 text-right font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-t hover:bg-muted/30 cursor-pointer"
              onClick={() => onEdit(task)}
            >
              <td className="px-4 py-2">{task.title}</td>
              <td className="px-4 py-2">{task.status}</td>
              <td className="px-4 py-2">{task.priority}</td>
              <td className="px-4 py-2">{task.assignee}</td>
              <td className="px-4 py-2 text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={(e) => {
                      e.stopPropagation(); // Чтобы клик по кнопке не открывал edit-модалку
                      onEdit(task);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation(); // Чтобы клик по кнопке не открывал edit-модалку
                      onDelete(task);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-muted-foreground"
              >
                Ничего не найдено
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
