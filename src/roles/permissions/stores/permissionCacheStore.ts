import type { SystemRole } from '../../types/roles';
import type { RolePermission } from '../../types/permission.types';

interface CachedPermissionSnapshot {
  userId: string;
  roles: SystemRole[];
  permissions: RolePermission[];
  cachedAt: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, CachedPermissionSnapshot>();

export function getCachedPermissions(userId: string): CachedPermissionSnapshot | null {
  const entry = cache.get(userId);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    cache.delete(userId);
    return null;
  }
  return entry;
}

export function setCachedPermissions(
  userId: string,
  roles: SystemRole[],
  permissions: Set<RolePermission>
): void {
  cache.set(userId, {
    userId,
    roles,
    permissions: [...permissions],
    cachedAt: Date.now(),
  });
}

export function invalidatePermissionCache(userId?: string): void {
  if (userId) cache.delete(userId);
  else cache.clear();
}
