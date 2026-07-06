import { useContext, useMemo } from 'react';
import { PlatformAdminModuleContext } from '../contexts/PlatformAdminContext';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createPlatformAdminServices } from '../services';

let cached: ReturnType<typeof createPlatformAdminServices> | null = null;

export function usePlatformAdminServices() {
  const ctx = useContext(PlatformAdminModuleContext);
  return useMemo(() => ctx?.services ?? (cached ??= createPlatformAdminServices(getBrowserClient())), [ctx]);
}

export function usePlatformAdminContext() {
  const ctx = useContext(PlatformAdminModuleContext);
  return {
    adminContext: ctx?.adminContext ?? null,
    adminId: ctx?.adminContext?.adminId ?? null,
    departments: ctx?.adminContext?.departments ?? [],
    permissions: ctx?.adminContext?.permissions ?? [],
  };
}
