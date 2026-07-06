export type RuntimeEnvironment = 'browser' | 'server' | 'edge';

export interface SupabaseBrowserEnv {
  url: string;
  anonKey: string;
  projectId?: string;
  logLevel?: string;
}

export interface SupabaseServerEnv extends SupabaseBrowserEnv {
  serviceRoleKey?: string;
}

export class SupabaseEnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SupabaseEnvError';
  }
}

function readViteEnv(name: string): string | undefined {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = import.meta.env[name];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }
  return undefined;
}

function readProcessEnv(name: string): string | undefined {
  const globalProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  if (globalProcess?.env) {
    const value = globalProcess.env[name];
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  }
  return undefined;
}

function readEnv(name: string): string | undefined {
  return readViteEnv(name) ?? readProcessEnv(name);
}

function requireEnv(name: string, runtime: RuntimeEnvironment): string {
  const value = readEnv(name);
  if (!value) {
    throw new SupabaseEnvError(
      `Missing required environment variable "${name}" for ${runtime} Supabase client.`
    );
  }
  return value;
}

export function getBrowserSupabaseEnv(): SupabaseBrowserEnv {
  return {
    url: requireEnv('VITE_SUPABASE_URL', 'browser'),
    anonKey: requireEnv('VITE_SUPABASE_ANON_KEY', 'browser'),
    projectId: readEnv('VITE_SUPABASE_PROJECT_ID'),
    logLevel: readEnv('VITE_LOG_LEVEL') ?? 'warn',
  };
}

export function getServerSupabaseEnv(): SupabaseServerEnv {
  const url = readEnv('VITE_SUPABASE_URL') ?? readEnv('SUPABASE_URL');
  const anonKey = readEnv('VITE_SUPABASE_ANON_KEY') ?? readEnv('SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    throw new SupabaseEnvError(
      'Missing SUPABASE_URL / SUPABASE_ANON_KEY (or VITE_ prefixed variants) for server client.'
    );
  }

  return {
    url,
    anonKey,
    serviceRoleKey: readEnv('SUPABASE_SERVICE_ROLE_KEY'),
    projectId: readEnv('VITE_SUPABASE_PROJECT_ID') ?? readEnv('SUPABASE_PROJECT_ID'),
    logLevel: readEnv('LOG_LEVEL') ?? readEnv('VITE_LOG_LEVEL') ?? 'warn',
  };
}

export function getEdgeSupabaseEnv(): SupabaseServerEnv {
  const url = readProcessEnv('SUPABASE_URL');
  const anonKey = readProcessEnv('SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    throw new SupabaseEnvError('Missing SUPABASE_URL or SUPABASE_ANON_KEY for edge runtime.');
  }

  return {
    url,
    anonKey,
    serviceRoleKey: readProcessEnv('SUPABASE_SERVICE_ROLE_KEY'),
    projectId: readProcessEnv('SUPABASE_PROJECT_ID'),
    logLevel: readProcessEnv('LOG_LEVEL') ?? 'warn',
  };
}

export function validateBrowserSupabaseEnv(): boolean {
  try {
    getBrowserSupabaseEnv();
    return true;
  } catch {
    return false;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(readEnv('VITE_SUPABASE_URL') && readEnv('VITE_SUPABASE_ANON_KEY'));
}
