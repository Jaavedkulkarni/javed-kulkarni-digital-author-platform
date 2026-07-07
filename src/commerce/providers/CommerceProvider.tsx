import { useMemo, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createCommerceServices } from '../services';
import { CommerceContext } from '../contexts/CommerceContext';
import { getCommerceQueryClient } from '../query/queryClient';
import { getCachedCommerceServices } from './commerceServicesCache';

export function CommerceProvider({ children }: { children: ReactNode }) {
  const services = useMemo(
    () => getCachedCommerceServices(() => createCommerceServices(getBrowserClient())),
    []
  );
  const value = useMemo(() => ({ services }), [services]);

  return (
    <QueryClientProvider client={getCommerceQueryClient()}>
      <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
    </QueryClientProvider>
  );
}
