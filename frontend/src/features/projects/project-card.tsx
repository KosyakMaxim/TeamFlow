import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/shared/types";
import { CalendarDays, ListTodo } from "lucide-react";
import Link from "next/link";


type ProjectCardProps = {
  project: Project;
};

// Карточка одного проекта
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ListTodo className="size-4" />
              {project.taskCount} задач
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="size-4" />
              {new Date(project.createdAt).toLocaleDateString("ru-RU")}
            </span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/project/${project.id}`}>
              Открыть
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
