"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Провайдер TanStack Query — создаёт QueryClient один раз и оборачивает детей
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState гарантирует, что клиент создаётся один раз, а не при каждом рендере
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Не перезапрашивать при фокусе окна (для разработки)
            refetchOnWindowFocus: false,
            // Повторить запрос 1 раз при ошибке
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
