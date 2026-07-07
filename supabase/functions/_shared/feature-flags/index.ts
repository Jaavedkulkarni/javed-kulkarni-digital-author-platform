import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import {
  ENTERPRISE_FEATURE_FLAGS,
  resolveFeatureFlag,
  type EnterpriseFeatureFlagId,
} from './resolver.ts';

export async function loadFeatureFlags(
  adminClient: SupabaseClient,
): Promise<Record<EnterpriseFeatureFlagId, boolean>> {
  const { data, error } = await adminClient
    .from('feature_flags')
    .select('id, enabled')
    .in('id', [...ENTERPRISE_FEATURE_FLAGS]);

  const flags = {} as Record<EnterpriseFeatureFlagId, boolean>;

  for (const id of ENTERPRISE_FEATURE_FLAGS) {
    const row = data?.find((r) => r.id === id);
    flags[id] = resolveFeatureFlag(id, row?.enabled ?? false);
  }

  if (error) {
    for (const id of ENTERPRISE_FEATURE_FLAGS) {
      flags[id] = resolveFeatureFlag(id, false);
    }
  }

  return flags;
}

export function requireFeatureFlag(
  flags: Record<EnterpriseFeatureFlagId, boolean>,
  flagId: EnterpriseFeatureFlagId,
): void {
  if (!flags[flagId]) {
    throw new Error(`Feature ${flagId} is disabled`);
  }
}

export { ENTERPRISE_FEATURE_FLAGS, resolveFeatureFlag };
export type { EnterpriseFeatureFlagId };
