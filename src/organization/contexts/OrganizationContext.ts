import { createContext } from 'react';
import type { OrganizationServices } from '../services';

export interface OrganizationContextValue {
  services: OrganizationServices;
}

export const OrganizationContext = createContext<OrganizationContextValue | null>(null);
