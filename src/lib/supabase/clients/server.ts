import { createClient, type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import type { Database } from '../../../types/database';
import { DEFAULT_AUTH_OPTIONS, DEFAULT_DB_SCHEMA } from '../config/constants';
import { getServerSupabaseEnv } from '../config/env';
import { setLogLevel, type LogLevel } from '../../utils/logger';
import type { TypedSupabaseClient } from './browser';

export interface CookieHandlers {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options?: CookieOptions) => void;
  remove: (name: string, options?: CookieOptions) => void;
}

export interface CookieOptions {
  maxAge?: number;
  domain?: string;
  path?: string;
  sameSite?: 'lax' | 'strict' | 'none';
  secure?: boolean;
}

export interface ServerClientOptions {
  cookies?: CookieHandlers;
  useServiceRole?: boolean;
  auth?: SupabaseClientOptions<'public'>['auth'];
  headers?: Record<string, string>;
}

function createAuthStorage(cookies?: CookieHandlers) {
  if (!cookies) return undefined;

  return {
    getItem: (key: string) => cookies.get(key) ?? null,
    setItem: (key: string, value: string) => {
      cookies.set(key, value, { path: '/', sameSite: 'lax', secure: true });
    },
    removeItem: (key: string) => {
      cookies.remove(key, { path: '/' });
    },
  };
}

export function createServerClient(options: ServerClientOptions = {}): TypedSupabaseClient {
  const env = getServerSupabaseEnv();

  if (env.logLevel) {
    setLogLevel(env.logLevel as LogLevel);
  }

  const apiKey = options.useServiceRole ? env.serviceRoleKey ?? env.anonKey : env.anonKey;

  if (options.useServiceRole && !env.serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service role server client.');
  }

  const customStorage = createAuthStorage(options.cookies);

  return createClient<Database>(env.url, apiKey, {
    auth: {
      ...DEFAULT_AUTH_OPTIONS,
      persistSession: Boolean(customStorage),
      storage: customStorage,
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

export function createServiceRoleClient(headers?: Record<string, string>): TypedSupabaseClient {
  return createServerClient({ useServiceRole: true, headers });
}

export type ServerSupabaseClient = SupabaseClient<Database>;
