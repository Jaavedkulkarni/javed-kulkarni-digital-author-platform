import { useContext, useMemo } from 'react';
import { SuperAdminModuleContext } from '../contexts/SuperAdminContext';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createSuperAdminServices } from '../services';

let cached: ReturnType<typeof createSuperAdminServices> | null = null;

export function useSuperAdminServices() {
  const ctx = useContext(SuperAdminModuleContext);
  return useMemo(() => ctx?.services ?? (cached ??= createSuperAdminServices(getBrowserClient())), [ctx]);
}

export function useSuperAdminContext() {
  const ctx = useContext(SuperAdminModuleContext);
  return {
    superAdminContext: ctx?.superAdminContext ?? null,
    isPrimarySuperAdmin: ctx?.superAdminContext?.isPrimarySuperAdmin ?? false,
  };
}
