import type { SystemRole } from '../../types/roles';
import { isSuperAdmin, isLegacySuperAdminEmail } from '../../lib/permissions';
import { PRIMARY_SUPER_ADMIN_EMAIL } from '../constants/superAdmin.constants';

export function canAccessSuperAdmin(roles: SystemRole[]): boolean {
  return isSuperAdmin(roles);
}

export function isPrimarySuperAdmin(email: string | null | undefined, roles: SystemRole[]): boolean {
  if (!isSuperAdmin(roles)) return false;
  if (!email) return false;
  return email.trim().toLowerCase() === PRIMARY_SUPER_ADMIN_EMAIL.toLowerCase() || isLegacySuperAdminEmail(email);
}

export function blockPlatformAdminAccess(roles: SystemRole[]): boolean {
  return roles.includes('admin') && !roles.includes('super_admin');
}

/** Only the Primary Super Admin (founder) may access the Super Admin dashboard. */
export function canAccessPrimarySuperAdminDashboard(
  email: string | null | undefined,
  roles: SystemRole[]
): boolean {
  if (blockPlatformAdminAccess(roles)) return false;
  return isPrimarySuperAdmin(email, roles);
}
