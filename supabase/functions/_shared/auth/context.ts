import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2';
import { UnauthorizedError } from '../errors/app-error.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

export function getBearerToken(req: Request): string | null {
  const header = req.headers.get('Authorization') ?? req.headers.get('authorization');
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

export function createUserClient(accessToken: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

export function createAdminClient(): SupabaseClient {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function resolveActor(req: Request): Promise<{ user: User; accessToken: string; userClient: SupabaseClient }> {
  const accessToken = getBearerToken(req);
  if (!accessToken) {
    throw new UnauthorizedError();
  }

  const userClient = createUserClient(accessToken);
  const { data, error } = await userClient.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new UnauthorizedError(error?.message ?? 'Invalid session');
  }

  return { user: data.user, accessToken, userClient };
}

export async function deleteAuthUser(adminClient: SupabaseClient, userId: string): Promise<void> {
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) {
    throw error;
  }
}
