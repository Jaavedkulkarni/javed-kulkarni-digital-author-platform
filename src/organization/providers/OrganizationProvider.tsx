import { useMemo, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createOrganizationServices } from '../services';
import { OrganizationContext } from '../contexts/OrganizationContext';
import { getOrganizationQueryClient } from '../query/queryClient';
import { getCachedOrganizationServices } from './organizationServicesCache';

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const services = useMemo(
    () => getCachedOrganizationServices(() => createOrganizationServices(getBrowserClient())),
    []
  );
  const value = useMemo(() => ({ services }), [services]);

  return (
    <QueryClientProvider client={getOrganizationQueryClient()}>
      <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>
    </QueryClientProvider>
  );
}
