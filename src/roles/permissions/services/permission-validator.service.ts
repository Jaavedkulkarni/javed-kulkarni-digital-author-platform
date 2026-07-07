import type { SystemRole } from '../../../types/roles';
import { PERMISSION_REGISTRY, ROLE_PERMISSION_MAP } from '../registry/permission.registry';
import type { PermissionValidationResult } from '../types/permission-registry.types';

function fail(errors: string[]): PermissionValidationResult {
  return { valid: false, errors };
}

function ok(): PermissionValidationResult {
  return { valid: true, errors: [] };
}

/** Validates permissions against the immutable registry and role maps. */
export class PermissionValidatorService {
  validatePermission(key: string): PermissionValidationResult {
    const permission = PERMISSION_REGISTRY.permissions[key];
    if (!permission) {
      return fail([`Unknown permission: ${key}`]);
    }
    if (!permission.isActive) {
      return fail([`Permission "${permission.title}" is inactive.`]);
    }
    return ok();
  }

  preventDuplicatePermissions(keys: readonly string[]): PermissionValidationResult {
    const seen = new Set<string>();
    const duplicates: string[] = [];

    for (const key of keys) {
      if (seen.has(key)) duplicates.push(key);
      seen.add(key);
    }

    return duplicates.length > 0
      ? fail([`Duplicate permissions detected: ${duplicates.join(', ')}`])
      : ok();
  }

  validateRolePermissions(role: SystemRole): PermissionValidationResult {
    const permissions = ROLE_PERMISSION_MAP[role];
    if (!permissions) {
      return fail([`Unknown role: ${role}`]);
    }

    const errors: string[] = [];
    for (const key of permissions) {
      const validation = this.validatePermission(key);
      if (!validation.valid) errors.push(...validation.errors);
    }

    const duplicateValidation = this.preventDuplicatePermissions(permissions);
    if (!duplicateValidation.valid) errors.push(...duplicateValidation.errors);

    if (role === 'publisher') {
      const readerLeak = permissions.filter((key) => key.startsWith('reader.'));
      if (readerLeak.length > 0) {
        errors.push('Publisher role must remain independent and cannot include reader permissions.');
      }
    }

    return errors.length > 0 ? fail(errors) : ok();
  }

  validateRegistry(): PermissionValidationResult {
    const errors: string[] = [];

    const duplicateValidation = this.preventDuplicatePermissions(PERMISSION_REGISTRY.keys);
    if (!duplicateValidation.valid) errors.push(...duplicateValidation.errors);

    for (const key of PERMISSION_REGISTRY.keys) {
      const validation = this.validatePermission(key);
      if (!validation.valid) errors.push(...validation.errors);
    }

    for (const role of Object.keys(ROLE_PERMISSION_MAP) as SystemRole[]) {
      const roleValidation = this.validateRolePermissions(role);
      if (!roleValidation.valid) errors.push(...roleValidation.errors);
    }

    return errors.length > 0 ? fail(errors) : ok();
  }
}

export const permissionValidatorService = new PermissionValidatorService();

export function createPermissionValidatorService(): PermissionValidatorService {
  return permissionValidatorService;
}
