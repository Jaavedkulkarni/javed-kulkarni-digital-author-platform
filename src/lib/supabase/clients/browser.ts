import { createClient, type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import type { Database } from '../../../types/database';
import { DEFAULT_AUTH_OPTIONS, DEFAULT_DB_SCHEMA } from '../config/constants';
import { getBrowserSupabaseEnv } from '../config/env';
import { setLogLevel, type LogLevel } from '../../utils/logger';

let browserClient: SupabaseClient<Database> | null = null;

export type TypedSupabaseClient = SupabaseClient<Database>;

export interface BrowserClientOptions {
  auth?: SupabaseClientOptions<'public'>['auth'];
  headers?: Record<string, string>;
}

export function createBrowserClient(options: BrowserClientOptions = {}): TypedSupabaseClient {
  const env = getBrowserSupabaseEnv();

  if (env.logLevel) {
    setLogLevel(env.logLevel as LogLevel);
  }

  return createClient<Database>(env.url, env.anonKey, {
    auth: {
      ...DEFAULT_AUTH_OPTIONS,
      ...options.auth,
    },
    db: {
      schema: DEFAULT_DB_SCHEMA,
    },
    global: {
      headers: options.headers,
    },
  });
}

export function getBrowserClient(options?: BrowserClientOptions): TypedSupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(options);
  }
  return browserClient;
}

export function resetBrowserClient(): void {
  browserClient = null;
}

export default getBrowserClient;
