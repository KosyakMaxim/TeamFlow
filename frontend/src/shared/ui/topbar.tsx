import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MobileSidebar } from "./mobile-sidebar";

// Верхняя панель — заголовок страницы + аватар пользователя
export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        {/* Гамбургер — виден только на мобильных */}
        <MobileSidebar />
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      {/* Аватар-заглушка */}
      <Avatar className="size-8">
        <AvatarFallback className="text-xs">MK</AvatarFallback>
      </Avatar>
    </header>
  );
}