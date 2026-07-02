import type { SystemRole } from '../types/roles';
import {
  canAccessAdminDashboard,
  canAccessAuthorDashboard,
  canAccessReaderDashboard,
  canAccessSuperAdminDashboard,
  getPrimaryRole,
  isStaff,
} from './permissions';

export function getDashboardPathForRole(role: SystemRole | null): string {
  switch (role) {
    case 'super_admin':
      return '/super';
    case 'admin':
      return '/admin';
    case 'author':
      return '/author';
    case 'reader':
      return '/reader';
    default:
      return '/';
  }
}

export function getStaffDashboardPath(roles: SystemRole[]): string {
  if (canAccessSuperAdminDashboard(roles)) return '/super';
  if (canAccessAdminDashboard(roles)) return '/admin';
  if (canAccessAuthorDashboard(roles)) return '/author';
  return '/admin/login';
}

export function getPostLoginPath(roles: SystemRole[], fallback?: string): string {
  const rolePath = getStaffDashboardPath(roles);

  if (!fallback || fallback === '/admin/login') {
    return rolePath;
  }

  if (fallback.startsWith('/super') && canAccessSuperAdminDashboard(roles)) return fallback;
  if (fallback.startsWith('/admin') && canAccessAdminDashboard(roles)) return fallback;
  if (fallback.startsWith('/author') && canAccessAuthorDashboard(roles)) return fallback;

  return rolePath;
}

export function getReaderPostLoginPath(): string {
  return '/reader/library';
}

export function resolvePrimaryDashboardPath(roles: SystemRole[]): string {
  return getDashboardPathForRole(getPrimaryRole(roles));
}

export function isStaffLoginEligible(roles: SystemRole[]): boolean {
  return isStaff(roles);
}

export function isReaderLoginEligible(roles: SystemRole[]): boolean {
  return canAccessReaderDashboard(roles);
}
