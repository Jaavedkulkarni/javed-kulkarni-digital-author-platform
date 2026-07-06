import { useMemo } from 'react';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createCommerceServices, type CommerceServices } from '../services';

let cachedServices: CommerceServices | null = null;

export function getCommerceServices(): CommerceServices {
  if (!cachedServices) {
    cachedServices = createCommerceServices(getBrowserClient());
  }
  return cachedServices;
}

export function useCommerceServices(): CommerceServices {
  return useMemo(() => getCommerceServices(), []);
}

export function resetCommerceServices(): void {
  cachedServices = null;
}
