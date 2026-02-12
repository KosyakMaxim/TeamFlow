import { Input } from "@/components/ui/input";
import { TASK_STATUSES, TaskStatus } from "@/shared/types";

type TaskFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: "all" | TaskStatus;
  onStatusChange: (value: "all" | TaskStatus) => void;
};

// Фильтры задач — поиск по названию и фильтр по статусу
export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Поиск по названию задачи..."
        className="sm:max-w-sm"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as "all" | TaskStatus)}
        className="h-9 rounded-md border bg-background px-3 text-sm sm:w-52"
      >
        <option value="all">Все статусы</option>
        {TASK_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
