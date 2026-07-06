import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../types/database';
import { DEFAULT_DB_SCHEMA } from '../config/constants';
import { getEdgeSupabaseEnv } from '../config/env';
import type { TypedSupabaseClient } from './browser';

export interface EdgeClientOptions {
  useServiceRole?: boolean;
  accessToken?: string;
}

export function createEdgeClient(options: EdgeClientOptions = {}): TypedSupabaseClient {
  const env = getEdgeSupabaseEnv();
  const apiKey = options.useServiceRole ? env.serviceRoleKey ?? env.anonKey : env.anonKey;

  if (options.useServiceRole && !env.serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for edge service role client.');
  }

  return createClient<Database>(env.url, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: DEFAULT_DB_SCHEMA,
    },
    global: {
      headers: options.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : undefined,
    },
  });
}

export default createEdgeClient;
