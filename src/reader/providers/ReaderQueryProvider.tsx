import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { getReaderQueryClient } from '../query/queryClient';
import { ReaderErrorBoundary } from './ReaderErrorBoundary';
import { useReaderRealtime } from '../realtime/useReaderRealtime';

function ReaderRealtimeBridge({ children }: { children: ReactNode }) {
  useReaderRealtime();
  return <>{children}</>;
}

export function ReaderQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getReaderQueryClient()}>
      <ReaderErrorBoundary>
        <ReaderRealtimeBridge>{children}</ReaderRealtimeBridge>
      </ReaderErrorBoundary>
    </QueryClientProvider>
  );
}
