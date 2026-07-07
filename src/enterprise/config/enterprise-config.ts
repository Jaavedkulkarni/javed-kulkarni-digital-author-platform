import { z } from 'zod';

const urlSchema = z.string().url();

export const enterpriseConfigSchema = z.object({
  supabaseUrl: urlSchema,
  supabaseAnonKey: z.string().min(1),
  appName: z.string().default('AuthorOS'),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  idempotencyTtlHours: z.number().int().positive().default(24),
  rateLimitEnabled: z.boolean().default(true),
  auditEnabled: z.boolean().default(true),
  activityLogEnabled: z.boolean().default(true),
  observabilityEnabled: z.boolean().default(true),
});

export type EnterpriseConfig = z.infer<typeof enterpriseConfigSchema>;

export function loadEnterpriseConfig(): EnterpriseConfig {
  const raw = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    appName: import.meta.env.VITE_APP_NAME ?? 'AuthorOS',
    environment: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE ?? 'development',
    idempotencyTtlHours: Number(import.meta.env.VITE_IDEMPOTENCY_TTL_HOURS ?? 24),
    rateLimitEnabled: import.meta.env.VITE_RATE_LIMIT_ENABLED !== 'false',
    auditEnabled: import.meta.env.VITE_AUDIT_ENABLED !== 'false',
    activityLogEnabled: import.meta.env.VITE_ACTIVITY_LOG_ENABLED !== 'false',
    observabilityEnabled: import.meta.env.VITE_OBSERVABILITY_ENABLED !== 'false',
  };

  return enterpriseConfigSchema.parse(raw);
}

let cachedConfig: EnterpriseConfig | null = null;

export function getEnterpriseConfig(): EnterpriseConfig {
  if (!cachedConfig) cachedConfig = loadEnterpriseConfig();
  return cachedConfig;
}

export function validateEnterpriseRuntimeConfig(): boolean {
  try {
    loadEnterpriseConfig();
    return true;
  } catch {
    return false;
  }
}
