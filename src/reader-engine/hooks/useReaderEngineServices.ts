import { useMemo } from 'react';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createReaderEngineServices, type ReaderEngineServices } from '../services';

let cachedServices: ReaderEngineServices | null = null;

export function getReaderEngineServices(): ReaderEngineServices {
  if (!cachedServices) {
    cachedServices = createReaderEngineServices(getBrowserClient());
  }
  return cachedServices;
}

export function useReaderEngineServices(): ReaderEngineServices {
  return useMemo(() => getReaderEngineServices(), []);
}

export function resetReaderEngineServices(): void {
  cachedServices = null;
}
