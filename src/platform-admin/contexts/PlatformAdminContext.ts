import { createContext } from 'react';
import type { PlatformAdminContext } from '../types/department.types';
import type { PlatformAdminServices } from '../services';

export interface PlatformAdminContextValue {
  services: PlatformAdminServices;
  adminContext: PlatformAdminContext | null;
}

export const PlatformAdminModuleContext = createContext<PlatformAdminContextValue | null>(null);
