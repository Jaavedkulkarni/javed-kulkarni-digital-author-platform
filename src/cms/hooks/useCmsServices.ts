import { useMemo } from 'react';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createCmsServices, type CmsServices } from '../services';

let cachedServices: CmsServices | null = null;

export function getCmsServices(): CmsServices {
  if (!cachedServices) {
    cachedServices = createCmsServices(getBrowserClient());
  }
  return cachedServices;
}

export function useCmsServices(): CmsServices {
  return useMemo(() => getCmsServices(), []);
}

export function resetCmsServices(): void {
  cachedServices = null;
}
