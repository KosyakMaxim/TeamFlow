import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        <Button asChild>
          <Link href="/login">Войти</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/register">Регистрация</Link>
        </Button>
      </div>
    </div>
  );
}
