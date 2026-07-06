import { QueryClient } from '@tanstack/react-query';

export function createReaderQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 2,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let readerQueryClient: QueryClient | null = null;

export function getReaderQueryClient(): QueryClient {
  if (!readerQueryClient) {
    readerQueryClient = createReaderQueryClient();
  }
  return readerQueryClient;
}

export function resetReaderQueryClient(): void {
  readerQueryClient = null;
}
