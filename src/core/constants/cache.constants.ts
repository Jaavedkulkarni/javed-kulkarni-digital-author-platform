export const CACHE_ROOT = 'enterprise' as const;

export const CACHE_KEYS = {
  root: [CACHE_ROOT] as const,
  people: {
    all: [CACHE_ROOT, 'people'] as const,
    list: (input: string) => [CACHE_ROOT, 'people', 'list', input] as const,
    stats: [CACHE_ROOT, 'people', 'stats'] as const,
    filters: [CACHE_ROOT, 'people', 'filters'] as const,
  },
  featureFlags: [CACHE_ROOT, 'feature-flags'] as const,
  health: [CACHE_ROOT, 'health'] as const,
  avatar: (userId: string) => [CACHE_ROOT, 'avatar', userId] as const,
  audit: (targetType: string, targetId: string) =>
    [CACHE_ROOT, 'audit', targetType, targetId] as const,
  activity: (targetType: string, targetId: string) =>
    [CACHE_ROOT, 'activity', targetType, targetId] as const,
  notifications: (userId: string) => [CACHE_ROOT, 'notifications', userId] as const,
  jobs: (queue: string) => [CACHE_ROOT, 'jobs', queue] as const,
} as const;

export const DEFAULT_CACHE_STALE_TIME_MS = 60_000;
export const DEFAULT_CACHE_GC_TIME_MS = 300_000;
