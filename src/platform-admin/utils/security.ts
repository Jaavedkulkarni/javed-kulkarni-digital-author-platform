import type { PlatformAdminDepartment } from '../types/department.types';
import { FORBIDDEN_PLATFORM_ADMIN_ACTIONS } from '../constants/platformAdmin.constants';
import { isSuperAdmin } from '../../lib/permissions';
import type { SystemRole } from '../../types/roles';

export function isForbiddenAction(action: string): boolean {
  return (FORBIDDEN_PLATFORM_ADMIN_ACTIONS as readonly string[]).includes(action);
}

export function canAccessPlatformAdmin(roles: SystemRole[]): boolean {
  return roles.includes('admin');
}

export function assertDepartmentAccess(
  departments: PlatformAdminDepartment[],
  required: PlatformAdminDepartment
): boolean {
  return departments.includes(required);
}

export function blockSuperAdminOnlyFeatures(roles: SystemRole[], action: string): boolean {
  if (isForbiddenAction(action)) return false;
  if (isSuperAdmin(roles) && action === 'super_admin') return false;
  return true;
}
