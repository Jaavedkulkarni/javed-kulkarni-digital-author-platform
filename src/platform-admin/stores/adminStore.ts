import type { PlatformAdminDepartment } from '../types/department.types';
import { resolvePermissionsForDepartments } from '../utils/permissions';

const DEFAULT_DEPARTMENTS: PlatformAdminDepartment[] = [
  'content',
  'paperback',
  'finance',
  'support',
  'marketing',
  'author_services',
  'legal',
];

const adminDepartments = new Map<string, PlatformAdminDepartment[]>();

export function getAdminDepartments(adminId: string): PlatformAdminDepartment[] {
  if (!adminDepartments.has(adminId)) {
    adminDepartments.set(adminId, [...DEFAULT_DEPARTMENTS]);
  }
  return adminDepartments.get(adminId) ?? [];
}

export function getAdminPermissions(adminId: string): string[] {
  return resolvePermissionsForDepartments(getAdminDepartments(adminId));
}

export function resetAdminStore(): void {
  adminDepartments.clear();
}
