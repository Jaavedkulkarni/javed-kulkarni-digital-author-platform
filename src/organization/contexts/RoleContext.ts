import { createContext } from 'react';
import type { UserRoleContext } from '../types/role.types';
import type { UserRoleAssignment } from '../types/role.types';

export interface OrganizationRoleContextValue {
  roleContext: UserRoleContext | null;
  assignments: UserRoleAssignment[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export const OrganizationRoleContext = createContext<OrganizationRoleContextValue | null>(null);
