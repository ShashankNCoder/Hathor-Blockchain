import { QueryClient } from "@tanstack/react-query";

// Create and configure the query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000, // 30 seconds
    },
    mutations: {
      retry: false,
    },
  },
});
