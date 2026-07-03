import type { SystemRole, UserProfile } from '../types/roles';

interface CachedRoleSnapshot {
  roles: SystemRole[];
  profile: UserProfile | null;
  cachedAt: number;
}

const roleCache = new Map<string, CachedRoleSnapshot>();
const CACHE_TTL_MS = 5 * 60 * 1000;

export function getCachedRoles(userId: string): SystemRole[] | null {
  const entry = roleCache.get(userId);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    roleCache.delete(userId);
    return null;
  }
  return entry.roles;
}

export function getCachedProfile(userId: string): UserProfile | null {
  const entry = roleCache.get(userId);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null;
  return entry.profile;
}

export function setCachedRoles(userId: string, roles: SystemRole[], profile: UserProfile | null): void {
  roleCache.set(userId, { roles, profile, cachedAt: Date.now() });
}

export function clearRoleCache(userId?: string): void {
  if (userId) roleCache.delete(userId);
  else roleCache.clear();
}
