export {
  ENTERPRISE_FEATURE_FLAGS,
  DEFAULT_ENTERPRISE_FLAG_STATE,
  type EnterpriseFeatureFlagId,
} from '../../core/constants/feature-flags.constants';

import {
  ENTERPRISE_FEATURE_FLAGS,
  DEFAULT_ENTERPRISE_FLAG_STATE,
  type EnterpriseFeatureFlagId,
} from '../../core/constants/feature-flags.constants';

const ENV_PREFIX = 'VITE_FEATURE_';

export function resolveEnterpriseFeatureFlag(
  flagId: EnterpriseFeatureFlagId,
  dbEnabled: boolean,
): boolean {
  const envKey = `${ENV_PREFIX}${flagId.replace(/^Enable/, '').toUpperCase()}`;
  const envValue = import.meta.env[envKey];
  if (envValue === 'true') return true;
  if (envValue === 'false') return false;
  return dbEnabled;
}

export function mergeEnterpriseFlags(
  dbFlags: Partial<Record<EnterpriseFeatureFlagId, boolean>>,
): Record<EnterpriseFeatureFlagId, boolean> {
  const merged = { ...DEFAULT_ENTERPRISE_FLAG_STATE, ...dbFlags };
  const resolved = {} as Record<EnterpriseFeatureFlagId, boolean>;
  for (const id of ENTERPRISE_FEATURE_FLAGS) {
    resolved[id] = resolveEnterpriseFeatureFlag(id, merged[id]);
  }
  return resolved;
}

export function isEnterpriseFeatureEnabled(
  flags: Record<EnterpriseFeatureFlagId, boolean>,
  flagId: EnterpriseFeatureFlagId,
): boolean {
  return flags[flagId] === true;
}
