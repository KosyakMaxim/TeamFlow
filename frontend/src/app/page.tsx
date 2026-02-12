import { Button } from "@/components/ui/button";

// Главная страница-заглушка
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">TeamFlow</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Управление задачами для команд
        </p>
      </div>
      <div className="flex gap-3">
        <Button>Войти</Button>
        <Button variant="outline">Регистрация</Button>
      </div>
    </div>
  );
}
