/**
 * AuthorOS Supabase Foundation
 * Production integration layer — import via '@/lib/supabase/index'
 *
 * Legacy code continues using src/lib/supabase.ts (unchanged).
 */

// Config
export * from './config';

// Clients
export {
  createBrowserClient,
  getBrowserClient,
  resetBrowserClient,
  type TypedSupabaseClient,
  type BrowserClientOptions,
} from './clients/browser';

export {
  createServerClient,
  createServiceRoleClient,
  type ServerClientOptions,
  type CookieHandlers,
  type CookieOptions,
  type ServerSupabaseClient,
} from './clients/server';

export { createEdgeClient, type EdgeClientOptions } from './clients/edge';

// Auth
export { AuthClient, createAuthClient, type AuthStateChangeCallback } from './auth/authClient';

// Storage
export { StorageClient, createStorageClient } from './storage/storageClient';

// Realtime
export {
  RealtimeClient,
  createRealtimeClient,
  type RealtimeSubscriptionOptions,
  type RealtimeChangePayload,
} from './realtime/realtimeClient';

// Platform factory
import { getBrowserClient, resetBrowserClient } from './clients/browser';
import { createAuthClient } from './auth/authClient';
import { createStorageClient } from './storage/storageClient';
import { createRealtimeClient } from './realtime/realtimeClient';
import { createDatabaseService } from '../database/databaseService';
import { createStorageService } from '../storage/storageService';
import { createRepositories } from '../repositories';

export interface SupabaseFoundation {
  client: ReturnType<typeof getBrowserClient>;
  auth: ReturnType<typeof createAuthClient>;
  storage: ReturnType<typeof createStorageClient>;
  storageService: ReturnType<typeof createStorageService>;
  database: ReturnType<typeof createDatabaseService>;
  realtime: ReturnType<typeof createRealtimeClient>;
  repositories: ReturnType<typeof createRepositories>;
}

let foundationInstance: SupabaseFoundation | null = null;

export function createSupabaseFoundation(): SupabaseFoundation {
  const client = getBrowserClient();

  return {
    client,
    auth: createAuthClient(client),
    storage: createStorageClient(client),
    storageService: createStorageService(client),
    database: createDatabaseService(client),
    realtime: createRealtimeClient(client),
    repositories: createRepositories(client),
  };
}

export function getSupabaseFoundation(): SupabaseFoundation {
  if (!foundationInstance) {
    foundationInstance = createSupabaseFoundation();
  }
  return foundationInstance;
}

export function resetSupabaseFoundation(): void {
  foundationInstance = null;
  resetBrowserClient();
}

// Re-export downstream layers for convenience
export * from '../database';
export * from '../storage';
export * from '../repositories';
export * from '../utils';
