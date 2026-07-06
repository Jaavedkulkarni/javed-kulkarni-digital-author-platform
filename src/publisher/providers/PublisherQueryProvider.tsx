import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { getPublisherQueryClient } from '../query/queryClient';

export function PublisherQueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={getPublisherQueryClient()}>{children}</QueryClientProvider>;
}
