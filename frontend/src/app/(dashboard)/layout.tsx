import { Sidebar } from "@/shared/ui/sidebar";
import { Topbar } from "@/shared/ui/topbar";

// Layout для всех страниц внутри (dashboard) — с sidebar и topbar
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar — скрыт на мобильных */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Основной контент */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}