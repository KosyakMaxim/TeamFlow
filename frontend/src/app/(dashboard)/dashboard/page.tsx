import { ProjectList } from "@/features/projects/project-list";
import { mockProjects } from "@/shared/mocks/projects";

// Страница Dashboard — список проектов пользователя
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Проекты</h2>
        <p className="mt-1 text-muted-foreground">
          Ваши проекты и команды
        </p>
      </div>

      <ProjectList projects={mockProjects} />
    </div>
  );
}