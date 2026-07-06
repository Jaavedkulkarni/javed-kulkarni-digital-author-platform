import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { getAuthorQueryClient } from '../query/queryClient';

export function AuthorQueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={getAuthorQueryClient()}>{children}</QueryClientProvider>;
}
