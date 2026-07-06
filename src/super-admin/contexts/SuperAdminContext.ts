import { createContext } from 'react';
import type { SuperAdminContext } from '../types/context.types';
import type { SuperAdminServices } from '../services';

export interface SuperAdminModuleContextValue {
  services: SuperAdminServices;
  superAdminContext: SuperAdminContext | null;
}

export const SuperAdminModuleContext = createContext<SuperAdminModuleContextValue | null>(null);
