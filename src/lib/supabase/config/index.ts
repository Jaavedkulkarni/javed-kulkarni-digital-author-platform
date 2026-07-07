export {
  getBrowserSupabaseEnv,
  getServerSupabaseEnv,
  getEdgeSupabaseEnv,
  validateBrowserSupabaseEnv,
  isSupabaseConfigured,
  SupabaseEnvError,
} from './env';
export type { SupabaseBrowserEnv, SupabaseServerEnv, RuntimeEnvironment } from './env';

export {
  DEFAULT_AUTH_OPTIONS,
  DEFAULT_DB_SCHEMA,
  REALTIME_EVENTS,
  HEALTH_CHECK_TABLE,
  HEALTH_CHECK_TIMEOUT_MS,
  DEFAULT_RETRY_ATTEMPTS,
  DEFAULT_RETRY_BASE_DELAY_MS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from './constants';
