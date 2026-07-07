import type { SystemRole } from '../../types/roles';
import type {
  RoleAssignmentValidationContext,
  RoleAssignmentValidationResult,
} from '../types/assignment.types';
import {
  PLATFORM_ADMIN_ASSIGNABLE_ROLES,
  PLATFORM_ADMIN_REMOVABLE_ROLES,
  PROTECTED_SYSTEM_ROLE,
  ROLE_ASSIGNMENT_MESSAGES,
  SUPER_ADMIN_ASSIGNABLE_ROLES,
  SUPER_ADMIN_REMOVABLE_ROLES,
} from '../constants/assignment.constants';
import { isPlatformAdmin, isSuperAdmin } from '../../lib/permissions';

export class RoleValidationService {
  canManageAssignments(actorRoles: SystemRole[]): boolean {
    return isPlatformAdmin(actorRoles);
  }

  getAssignableRoles(actorRoles: SystemRole[]): SystemRole[] {
    if (isSuperAdmin(actorRoles)) return [...SUPER_ADMIN_ASSIGNABLE_ROLES];
    if (isPlatformAdmin(actorRoles)) return [...PLATFORM_ADMIN_ASSIGNABLE_ROLES];
    return [];
  }

  getRemovableRoles(actorRoles: SystemRole[]): SystemRole[] {
    if (isSuperAdmin(actorRoles)) return [...SUPER_ADMIN_REMOVABLE_ROLES];
    if (isPlatformAdmin(actorRoles)) return [...PLATFORM_ADMIN_REMOVABLE_ROLES];
    return [];
  }

  validateAssignment(context: RoleAssignmentValidationContext): RoleAssignmentValidationResult {
    const errors: string[] = [];

    if (!this.canManageAssignments(context.actorRoles)) {
      errors.push(ROLE_ASSIGNMENT_MESSAGES.INSUFFICIENT_PERMISSIONS);
      return { valid: false, errors };
    }

    const assignable = this.getAssignableRoles(context.actorRoles);
    if (!assignable.includes(context.role)) {
      errors.push(ROLE_ASSIGNMENT_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    if (context.targetRoles.includes(context.role)) {
      errors.push(ROLE_ASSIGNMENT_MESSAGES.ALREADY_ASSIGNED);
    }

    if (
      context.targetUserId === context.actorId &&
      !isSuperAdmin(context.actorRoles) &&
      (context.role === 'admin' || context.role === 'super_admin')
    ) {
      errors.push(ROLE_ASSIGNMENT_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    return { valid: errors.length === 0, errors };
  }

  validateRemoval(
    context: RoleAssignmentValidationContext,
    activeSuperAdminCount: number
  ): RoleAssignmentValidationResult {
    const errors: string[] = [];

    if (!this.canManageAssignments(context.actorRoles)) {
      errors.push(ROLE_ASSIGNMENT_MESSAGES.INSUFFICIENT_PERMISSIONS);
      return { valid: false, errors };
    }

    if (context.role === PROTECTED_SYSTEM_ROLE) {
      errors.push(ROLE_ASSIGNMENT_MESSAGES.READER_CANNOT_REMOVE);
      return { valid: false, errors };
    }

    const removable = this.getRemovableRoles(context.actorRoles);
    if (!removable.includes(context.role)) {
      errors.push(ROLE_ASSIGNMENT_MESSAGES.INSUFFICIENT_PERMISSIONS);
    }

    if (!context.targetRoles.includes(context.role)) {
      errors.push(ROLE_ASSIGNMENT_MESSAGES.NOT_ASSIGNED);
    }

    if (
      context.role === 'super_admin' &&
      context.targetUserId === context.actorId &&
      activeSuperAdminCount <= 1
    ) {
      errors.push(ROLE_ASSIGNMENT_MESSAGES.LAST_SUPER_ADMIN);
    }

    return { valid: errors.length === 0, errors };
  }
}

export function createRoleValidationService(): RoleValidationService {
  return new RoleValidationService();
}
