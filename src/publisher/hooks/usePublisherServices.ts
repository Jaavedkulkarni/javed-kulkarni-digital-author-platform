import { useMemo } from 'react';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createPublisherServices, type PublisherServices } from '../services';

let cachedServices: PublisherServices | null = null;

export function getPublisherServices(): PublisherServices {
  if (!cachedServices) {
    cachedServices = createPublisherServices(getBrowserClient());
  }
  return cachedServices;
}

export function usePublisherServices(): PublisherServices {
  return useMemo(() => getPublisherServices(), []);
}

export function resetPublisherServices(): void {
  cachedServices = null;
}
