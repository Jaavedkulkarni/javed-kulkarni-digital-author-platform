import type { QueryClient } from '@tanstack/react-query';
import { CACHE_KEYS } from '../../core/constants/cache.constants';

export type EnterpriseCacheKey = readonly unknown[];

export function serializeCacheKey(key: EnterpriseCacheKey): string {
  return JSON.stringify(key);
}

export const enterpriseCacheKeys = CACHE_KEYS;

export function invalidatePeopleCache(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: CACHE_KEYS.people.all });
}

export function invalidateAvatarCache(queryClient: QueryClient, userId: string): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: CACHE_KEYS.avatar(userId) });
}

export function invalidateFeatureFlagsCache(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: CACHE_KEYS.featureFlags });
}

export function invalidateHealthCache(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: CACHE_KEYS.health });
}

export function invalidateEnterpriseAll(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: CACHE_KEYS.root });
}

export class EnterpriseCacheInvalidator {
  constructor(private readonly queryClient: QueryClient) {}

  people(): Promise<void> {
    return invalidatePeopleCache(this.queryClient);
  }

  avatar(userId: string): Promise<void> {
    return invalidateAvatarCache(this.queryClient, userId);
  }

  featureFlags(): Promise<void> {
    return invalidateFeatureFlagsCache(this.queryClient);
  }

  health(): Promise<void> {
    return invalidateHealthCache(this.queryClient);
  }

  all(): Promise<void> {
    return invalidateEnterpriseAll(this.queryClient);
  }
}

export function createEnterpriseCacheInvalidator(queryClient: QueryClient): EnterpriseCacheInvalidator {
  return new EnterpriseCacheInvalidator(queryClient);
}

export interface EnterpriseServerCacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class InMemoryEnterpriseServerCache implements EnterpriseServerCacheAdapter {
  private store = new Map<string, { value: unknown; expiresAt: number | null }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}
