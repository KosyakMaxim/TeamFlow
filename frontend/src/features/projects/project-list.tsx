import { Project } from "@/shared/types";
import { ProjectCard } from "./project-card";

type ProjectListProps = {
  projects: Project[];
};

// Сетка карточек проектов
export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground">Проектов пока нет</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}