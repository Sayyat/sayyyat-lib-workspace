"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// QueryClient-ті бір-ақ рет жасау үшін осылай жасаймыз
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 минут
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: Әрқашан жаңа клиент жасау
    return makeQueryClient();
  } else {
    // Browser: Клиентті қайта пайдалану
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}