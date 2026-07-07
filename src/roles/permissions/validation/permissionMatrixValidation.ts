import type { SystemRole } from '../../types/roles';
import {
  ALL_ROLE_PERMISSIONS,
  ROLE_PERMISSION_MATRIX,
  type RolePermission,
} from '../../types/permission.types';

export interface PermissionMatrixValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePermissionMatrix(): PermissionMatrixValidationResult {
  const errors: string[] = [];

  for (const role of Object.keys(ROLE_PERMISSION_MATRIX) as SystemRole[]) {
    const permissions = ROLE_PERMISSION_MATRIX[role];
    if (!permissions || permissions.length === 0) {
      errors.push(`Role "${role}" has no permissions assigned.`);
    }
    for (const permission of permissions) {
      if (!ALL_ROLE_PERMISSIONS.includes(permission)) {
        errors.push(`Role "${role}" references unknown permission "${permission}".`);
      }
    }
  }

  const readerPermissions = new Set(ROLE_PERMISSION_MATRIX.reader);
  for (const permission of ROLE_PERMISSION_MATRIX.author) {
    if (readerPermissions.has(permission) && !ROLE_PERMISSION_MATRIX.reader.includes(permission)) {
      // inherited reader permissions in author — expected
    }
  }

  if (!ROLE_PERMISSION_MATRIX.reader.includes('reader.read' as RolePermission)) {
    errors.push('Reader role must include reader.read permission.');
  }

  if (ROLE_PERMISSION_MATRIX.super_admin.length !== ALL_ROLE_PERMISSIONS.length) {
    errors.push('Super Admin must inherit the complete permission registry.');
  }

  return { valid: errors.length === 0, errors };
}

export function validateRoleCombination(roles: SystemRole[]): PermissionMatrixValidationResult {
  const errors: string[] = [];
  if (roles.length === 0) {
    errors.push('At least one role is required for permission evaluation.');
  }
  for (const role of roles) {
    if (!(role in ROLE_PERMISSION_MATRIX)) {
      errors.push(`Unknown role "${role}".`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function runPermissionMatrixValidation(): void {
  const result = validatePermissionMatrix();
  if (!result.valid) {
    throw new Error(`Permission matrix validation failed:\n${result.errors.join('\n')}`);
  }
}
