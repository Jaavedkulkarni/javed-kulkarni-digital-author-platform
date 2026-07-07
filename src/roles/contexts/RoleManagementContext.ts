import { createContext } from 'react';
import type { RoleManagementServices } from '../services';

export interface RoleManagementContextValue {
  services: RoleManagementServices;
  userId: string | null;
  refreshRoles: () => Promise<void>;
}

export const RoleManagementContext = createContext<RoleManagementContextValue | null>(null);
