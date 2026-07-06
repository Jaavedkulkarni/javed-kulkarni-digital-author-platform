import { useMemo } from 'react';
import { getBrowserClient } from '../../lib/supabase/clients/browser';
import { createAuthorServices, type AuthorServices } from '../services';

let cachedServices: AuthorServices | null = null;

export function getAuthorServices(): AuthorServices {
  if (!cachedServices) {
    cachedServices = createAuthorServices(getBrowserClient());
  }
  return cachedServices;
}

export function useAuthorServices(): AuthorServices {
  return useMemo(() => getAuthorServices(), []);
}

export function resetAuthorServices(): void {
  cachedServices = null;
}
