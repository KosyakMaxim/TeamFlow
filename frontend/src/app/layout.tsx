import { QueryProvider } from "@/shared/lib/query-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Подключаем шрифт Inter через next/font — автоматическая оптимизация
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

// Метаданные приложения — отображаются во вкладке браузера и SEO
export const metadata: Metadata = {
  title: "TeamFlow by Kosyak Maxim",
  description: "Платформа для управления задачами внутри команд",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
