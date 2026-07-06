import { QueryClient } from '@tanstack/react-query';

export function createPlatformAdminQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
    },
  });
}

let client: QueryClient | null = null;

export function getPlatformAdminQueryClient(): QueryClient {
  if (!client) client = createPlatformAdminQueryClient();
  return client;
}

export function resetPlatformAdminQueryClient(): void {
  client = null;
}
