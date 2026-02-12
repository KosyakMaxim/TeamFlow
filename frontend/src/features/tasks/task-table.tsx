import { Task } from "@/shared/types";

type TaskTableProps = {
  tasks: Task[];
};

// Таблица задач
export function TaskTable({ tasks }: TaskTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full min-w-[700px] text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Название</th>
            <th className="px-4 py-2 text-left font-medium">Статус</th>
            <th className="px-4 py-2 text-left font-medium">Приоритет</th>
            <th className="px-4 py-2 text-left font-medium">Исполнитель</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t">
              <td className="px-4 py-2">{task.title}</td>
              <td className="px-4 py-2">{task.status}</td>
              <td className="px-4 py-2">{task.priority}</td>
              <td className="px-4 py-2">{task.assignee}</td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                Ничего не найдено
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
