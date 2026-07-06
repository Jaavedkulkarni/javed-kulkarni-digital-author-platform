import { useContext, useMemo } from 'react';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createOrganizationServices, type OrganizationServices } from '../services';
import { OrganizationContext } from '../contexts/OrganizationContext';

let cachedServices: OrganizationServices | null = null;

export function getOrganizationServices(): OrganizationServices {
  if (!cachedServices) {
    cachedServices = createOrganizationServices(getBrowserClient());
  }
  return cachedServices;
}

export function useOrganizationServices(): OrganizationServices {
  const ctx = useContext(OrganizationContext);
  return useMemo(() => ctx?.services ?? getOrganizationServices(), [ctx]);
}

export function resetOrganizationServices(): void {
  cachedServices = null;
}
