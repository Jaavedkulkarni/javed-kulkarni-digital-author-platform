import { useContext, useMemo } from 'react';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createCommerceServices, type CommerceServices } from '../services';
import { CommerceContext } from '../contexts/CommerceContext';

let cachedServices: CommerceServices | null = null;

export function getCommerceServices(): CommerceServices {
  if (!cachedServices) {
    cachedServices = createCommerceServices(getBrowserClient());
  }
  return cachedServices;
}

export function useCommerceServices(): CommerceServices {
  const ctx = useContext(CommerceContext);
  return useMemo(() => ctx?.services ?? getCommerceServices(), [ctx]);
}

export function resetCommerceServices(): void {
  cachedServices = null;
}
