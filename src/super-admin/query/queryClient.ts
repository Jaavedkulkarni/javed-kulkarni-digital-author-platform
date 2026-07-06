import { QueryClient } from '@tanstack/react-query';

export function createSuperAdminQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } } });
}

let client: QueryClient | null = null;
export function getSuperAdminQueryClient(): QueryClient {
  if (!client) client = createSuperAdminQueryClient();
  return client;
}
export function resetSuperAdminQueryClient(): void { client = null; }
