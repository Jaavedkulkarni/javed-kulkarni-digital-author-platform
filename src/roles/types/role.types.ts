import type { SystemRole } from '../../types/roles';

export type RoleSlug = SystemRole;

export interface RoleRecord {
  id: string;
  name: SystemRole;
  slug: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  roleName: SystemRole;
  roleSlug: string;
  assignedAt: string;
  assignedBy: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUserRoleSnapshot {
  userId: string;
  roles: SystemRole[];
  assignments: UserRoleAssignment[];
  loadedAt: string;
}

export interface AssignRoleInput {
  userId: string;
  role: SystemRole;
  assignedBy: string;
}

export interface RemoveRoleInput {
  userId: string;
  role: SystemRole;
  actorId: string;
}
