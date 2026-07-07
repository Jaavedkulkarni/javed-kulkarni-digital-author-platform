export const DEFAULT_AUTH_OPTIONS = {
  detectSessionInUrl: true,
  flowType: 'pkce' as const,
  persistSession: true,
  autoRefreshToken: true,
};

export const DEFAULT_DB_SCHEMA = 'public' as const;

export const REALTIME_EVENTS = ['INSERT', 'UPDATE', 'DELETE'] as const;

export const HEALTH_CHECK_TABLE = 'profiles' as const;

export const HEALTH_CHECK_TIMEOUT_MS = 5000;

export const DEFAULT_RETRY_ATTEMPTS = 3;

export const DEFAULT_RETRY_BASE_DELAY_MS = 300;

export const DEFAULT_PAGE_SIZE = 20;

export const MAX_PAGE_SIZE = 100;
