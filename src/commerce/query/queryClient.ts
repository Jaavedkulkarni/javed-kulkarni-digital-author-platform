import { QueryClient } from '@tanstack/react-query';

export function createCommerceQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let commerceQueryClient: QueryClient | null = null;

export function getCommerceQueryClient(): QueryClient {
  if (!commerceQueryClient) commerceQueryClient = createCommerceQueryClient();
  return commerceQueryClient;
}

export function resetCommerceQueryClient(): void {
  commerceQueryClient = null;
}
