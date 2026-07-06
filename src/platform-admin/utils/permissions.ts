import type { PlatformAdminDepartment } from '../types/department.types';
import { DEPARTMENT_PERMISSIONS } from '../constants/platformAdmin.constants';

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function resolvePermissionsForDepartments(
  departments: PlatformAdminDepartment[]
): string[] {
  const perms = new Set<string>();
  for (const dept of departments) {
    for (const p of DEPARTMENT_PERMISSIONS[dept] ?? []) {
      perms.add(p);
    }
  }
  return [...perms];
}

export function hasDepartmentAccess(
  departments: PlatformAdminDepartment[],
  required: PlatformAdminDepartment
): boolean {
  return departments.includes(required);
}

export function hasPermission(permissions: string[], required: string): boolean {
  return permissions.includes(required);
}
