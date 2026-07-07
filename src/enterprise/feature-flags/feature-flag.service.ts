import { getBrowserClient } from '../../lib/supabase/clients/browser';
import {
  DEFAULT_ENTERPRISE_FLAGS,
  ENTERPRISE_FEATURE_FLAGS,
  mergeEnterpriseFlags,
  type EnterpriseFeatureFlagId,
  type EnterpriseFeatureFlagMap,
} from './enterprise-flags';

export class EnterpriseFeatureFlagService {
  private cache: EnterpriseFeatureFlagMap = { ...DEFAULT_ENTERPRISE_FLAGS };
  private loadedAt: number | null = null;
  private readonly ttlMs = 60_000;

  async load(force = false): Promise<EnterpriseFeatureFlagMap> {
    if (!force && this.loadedAt && Date.now() - this.loadedAt < this.ttlMs) {
      return this.cache;
    }

    const client = getBrowserClient();
    const { data, error } = await client
      .from('feature_flags')
      .select('id, enabled')
      .in('id', [...ENTERPRISE_FEATURE_FLAGS]);

    if (error || !data) {
      this.cache = mergeEnterpriseFlags({});
      this.loadedAt = Date.now();
      return this.cache;
    }

    const dbFlags = Object.fromEntries(
      data.map((row) => [row.id as EnterpriseFeatureFlagId, row.enabled]),
    ) as Partial<EnterpriseFeatureFlagMap>;

    this.cache = mergeEnterpriseFlags(dbFlags);
    this.loadedAt = Date.now();
    return this.cache;
  }

  getCached(): EnterpriseFeatureFlagMap {
    return this.cache;
  }

  async isEnabled(flagId: EnterpriseFeatureFlagId): Promise<boolean> {
    const flags = await this.load();
    return flags[flagId] === true;
  }
}

let service: EnterpriseFeatureFlagService | null = null;

export function getEnterpriseFeatureFlagService(): EnterpriseFeatureFlagService {
  if (!service) service = new EnterpriseFeatureFlagService();
  return service;
}
