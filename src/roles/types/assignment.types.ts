import type { SystemRole } from '../../types/roles';

export type RoleAssignmentAction = 'assigned' | 'removed';

export interface RoleAssignmentLog {
  id: string;
  userId: string;
  roleId: string;
  roleName: SystemRole;
  action: RoleAssignmentAction;
  assignedBy: string | null;
  reason: string | null;
  createdAt: string;
}

export interface AssignUserRoleInput {
  targetUserId: string;
  role: SystemRole;
  reason?: string | null;
}

export interface RemoveUserRoleInput {
  targetUserId: string;
  role: SystemRole;
  reason?: string | null;
}

export interface RoleAssignmentValidationContext {
  actorId: string;
  actorRoles: SystemRole[];
  targetUserId: string;
  targetRoles: SystemRole[];
  role: SystemRole;
}

export interface RoleAssignmentValidationResult {
  valid: boolean;
  errors: string[];
}

export interface RoleAssignmentOutcome {
  logId: string;
  targetUserId: string;
  role: SystemRole;
  assignments: import('./role.types').UserRoleAssignment[];
}
