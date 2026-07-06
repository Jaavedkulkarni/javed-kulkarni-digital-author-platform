import type { CoreFeatureFlag, FeatureFlagOverride, FeatureFlagState } from '../types/featureFlag.types';
import type { ConfigurationService } from '../config/configurationService';
import { DEFAULT_FEATURE_FLAGS } from './defaultFlags';

export class FeatureFlagEngine {
  private runtimeOverrides = new Map<CoreFeatureFlag, boolean>();

  constructor(private readonly config?: ConfigurationService) {}

  resolveState(): FeatureFlagState {
    const flags = {} as Record<CoreFeatureFlag, boolean>;

    for (const definition of DEFAULT_FEATURE_FLAGS) {
      const configValue = this.config?.getFeatureFlag(definition.id);
      const runtimeValue = this.runtimeOverrides.get(definition.id);
      flags[definition.id] = runtimeValue ?? configValue ?? definition.defaultEnabled;
    }

    const source = this.runtimeOverrides.size > 0 ? 'runtime' : this.config ? 'config' : 'default';

    return { flags, source };
  }

  isEnabled(flag: CoreFeatureFlag): boolean {
    return this.resolveState().flags[flag];
  }

  enable(flag: CoreFeatureFlag): void {
    this.runtimeOverrides.set(flag, true);
    this.config?.setFeatureFlag(flag, true);
  }

  disable(flag: CoreFeatureFlag): void {
    this.runtimeOverrides.set(flag, false);
    this.config?.setFeatureFlag(flag, false);
  }

  setOverride(override: FeatureFlagOverride): void {
    this.runtimeOverrides.set(override.flag, override.enabled);
  }

  clearOverride(flag: CoreFeatureFlag): void {
    this.runtimeOverrides.delete(flag);
  }

  getDefinitions() {
    return DEFAULT_FEATURE_FLAGS;
  }
}

let featureFlagEngineInstance: FeatureFlagEngine | null = null;

export function getFeatureFlagEngine(config?: ConfigurationService): FeatureFlagEngine {
  if (!featureFlagEngineInstance) {
    featureFlagEngineInstance = new FeatureFlagEngine(config);
  }
  return featureFlagEngineInstance;
}

export function resetFeatureFlagEngine(): void {
  featureFlagEngineInstance = null;
}

export function createFeatureFlagEngine(config?: ConfigurationService): FeatureFlagEngine {
  return new FeatureFlagEngine(config);
}
