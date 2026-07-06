import { useMemo, type ReactNode } from 'react';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { useRoles } from '../../context/RoleContext';
import { createPlatformAdminServices } from '../services';
import { PlatformAdminModuleContext } from '../contexts/PlatformAdminContext';
import { getPlatformAdminQueryClient } from '../query/queryClient';
import { platformAdminQueryKeys } from '../query/queryKeys';
import { canAccessPlatformAdmin } from '../utils/security';

let cached: ReturnType<typeof createPlatformAdminServices> | null = null;

function getServices() {
  if (!cached) cached = createPlatformAdminServices(getBrowserClient());
  return cached;
}

function PlatformAdminContextBridge({ children }: { children: ReactNode }) {
  const { profile, roles, loading } = useRoles();
  const services = useMemo(() => getServices(), []);
  const profileId = profile?.id ?? null;
  const allowed = canAccessPlatformAdmin(roles);

  const contextQuery = useQuery({
    queryKey: platformAdminQueryKeys.context(profileId ?? 'guest'),
    queryFn: () => services.context.resolveContext(profileId!, roles),
    enabled: Boolean(profileId && allowed),
  });

  const value = useMemo(
    () => ({ services, adminContext: allowed ? contextQuery.data ?? null : null }),
    [services, contextQuery.data, allowed]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <PlatformAdminModuleContext.Provider value={value}>{children}</PlatformAdminModuleContext.Provider>
  );
}

export function PlatformAdminProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getPlatformAdminQueryClient()}>
      <PlatformAdminContextBridge>{children}</PlatformAdminContextBridge>
    </QueryClientProvider>
  );
}
