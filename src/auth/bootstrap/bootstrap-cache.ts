import { buildFullNavigation } from '../../navigation';
import type { SystemRole, UserProfile } from '../../types/roles';
import type { AuthBootstrapPayload } from './auth-bootstrap.types';
import type { User } from '@supabase/supabase-js';

const CACHE_KEY = 'authBootstrapSnapshot';
const CACHE_TTL_MS = 5 * 60 * 1000;

export interface CachedBootstrapSnapshot {
  userId: string;
  assignedRoles: SystemRole[];
  effectiveRoles: SystemRole[];
  permissions: string[];
  profile: UserProfile | null;
  cachedAt: number;
}

export function readCachedBootstrapSnapshot(userId: string): CachedBootstrapSnapshot | null {
  if (typeof sessionStorage === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw) as CachedBootstrapSnapshot;
    if (cached.userId !== userId) return null;
    if (Date.now() - cached.cachedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }

    console.log('[7] BOOTSTRAP READY cache hit', { userId, cachedAt: cached.cachedAt });
    return cached;
  } catch {
    return null;
  }
}

export function hydrateBootstrapFromCache(user: User, cached: CachedBootstrapSnapshot): AuthBootstrapPayload {
  return {
    user,
    profile: cached.profile,
    assignedRoles: cached.assignedRoles,
    effectiveRoles: cached.effectiveRoles,
    permissions: cached.permissions,
    navigation: buildFullNavigation({
      roles: cached.assignedRoles,
      permissions: cached.permissions,
    }),
  };
}

export function writeBootstrapCache(payload: AuthBootstrapPayload): void {
  if (typeof sessionStorage === 'undefined') return;

  const snapshot: CachedBootstrapSnapshot = {
    userId: payload.user.id,
    assignedRoles: payload.assignedRoles,
    effectiveRoles: payload.effectiveRoles,
    permissions: payload.permissions,
    profile: payload.profile,
    cachedAt: Date.now(),
  };

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore quota errors — cache is an optimization only.
  }
}

export function clearBootstrapCache(): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(CACHE_KEY);
}
