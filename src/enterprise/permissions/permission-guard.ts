export type EnterprisePermission = 'super_admin' | 'admin' | 'staff' | 'authenticated';

export function hasEnterprisePermission(
  roles: string[],
  permission: EnterprisePermission,
): boolean {
  if (permission === 'authenticated') return true;
  if (permission === 'super_admin') return roles.includes('super_admin');
  if (permission === 'admin') return roles.includes('super_admin') || roles.includes('admin');
  if (permission === 'staff') {
    return roles.some((r) => ['super_admin', 'admin', 'author', 'publisher'].includes(r));
  }
  return false;
}

export function assertEnterprisePermission(
  roles: string[],
  permission: EnterprisePermission,
  message?: string,
): void {
  if (!hasEnterprisePermission(roles, permission)) {
    throw new Error(message ?? `Permission denied: ${permission}`);
  }
}
