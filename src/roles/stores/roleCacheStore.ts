import type { CurrentUserRoleSnapshot } from '../types/role.types';

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  snapshot: CurrentUserRoleSnapshot;
  cachedAt: number;
}

const cache = new Map<string, CacheEntry>();

export function getCachedUserRoles(userId: string): CurrentUserRoleSnapshot | null {
  const entry = cache.get(userId);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    cache.delete(userId);
    return null;
  }
  return entry.snapshot;
}

export function setCachedUserRoles(snapshot: CurrentUserRoleSnapshot): void {
  cache.set(snapshot.userId, { snapshot, cachedAt: Date.now() });
}

export function invalidateUserRoleCache(userId?: string): void {
  if (userId) cache.delete(userId);
  else cache.clear();
}

export function getRoleCacheTtlMs(): number {
  return CACHE_TTL_MS;
}
