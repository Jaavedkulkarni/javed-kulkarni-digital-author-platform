import type { SystemRole } from '../../types/roles';
import type { AuthRole } from '../../auth/types/roles.types';

export interface RoleRecord {
  id: string;
  name: SystemRole;
  createdAt: string;
}

export interface UserRoleAssignment {
  userId: string;
  roleId: string;
  roleName: SystemRole;
  assignedAt: string;
  assignedBy: string | null;
}

export interface UserRoleContext {
  systemRoles: SystemRole[];
  authRoles: AuthRole[];
  hasSuperAdmin: boolean;
  hasPlatformAdmin: boolean;
  isReader: boolean;
}
