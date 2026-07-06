import { useMemo, type ReactNode } from 'react';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { useRoles } from '../../context/RoleContext';
import { createSuperAdminServices } from '../services';
import { SuperAdminModuleContext } from '../contexts/SuperAdminContext';
import { getSuperAdminQueryClient } from '../query/queryClient';
import { superAdminQueryKeys } from '../query/queryKeys';
import { canAccessPrimarySuperAdminDashboard } from '../security/accessControl';

let cached: ReturnType<typeof createSuperAdminServices> | null = null;
function getServices() {
  if (!cached) cached = createSuperAdminServices(getBrowserClient());
  return cached;
}

function SuperAdminContextBridge({ children }: { children: ReactNode }) {
  const { profile, roles, loading } = useRoles();
  const services = useMemo(() => getServices(), []);
  const profileId = profile?.id ?? null;
  const allowed = canAccessPrimarySuperAdminDashboard(profile?.email, roles);

  const contextQuery = useQuery({
    queryKey: superAdminQueryKeys.context(profileId ?? 'guest'),
    queryFn: () => services.context.resolveContext(profileId!, roles),
    enabled: Boolean(profileId && allowed),
  });

  const value = useMemo(
    () => ({ services, superAdminContext: allowed ? contextQuery.data ?? null : null }),
    [services, contextQuery.data, allowed]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return <SuperAdminModuleContext.Provider value={value}>{children}</SuperAdminModuleContext.Provider>;
}

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getSuperAdminQueryClient()}>
      <SuperAdminContextBridge>{children}</SuperAdminContextBridge>
    </QueryClientProvider>
  );
}
