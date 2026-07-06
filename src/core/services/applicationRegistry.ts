import type { CoreModuleId } from '../types/module.types';
import type { CoreFeatureFlag } from '../types/featureFlag.types';
import { getModuleRegistry } from './moduleRegistry';
import type { FeatureFlagEngine } from '../feature-flags/featureFlagEngine';

const MODULE_FEATURE_MAP: Partial<Record<CoreModuleId, CoreFeatureFlag>> = {
  cms: 'cms',
  payments: 'payments',
  analytics: 'analytics',
  'hav-ai': 'hav-ai',
  blog: 'blog',
};

export class ApplicationRegistry {
  constructor(
    private readonly featureFlags?: FeatureFlagEngine
  ) {}

  isModuleEnabled(moduleId: CoreModuleId): boolean {
    const flag = MODULE_FEATURE_MAP[moduleId];
    if (!flag || !this.featureFlags) return true;
    return this.featureFlags.isEnabled(flag);
  }

  getEnabledModules(): CoreModuleId[] {
    return getModuleRegistry()
      .getAll()
      .map((module) => module.id)
      .filter((moduleId) => this.isModuleEnabled(moduleId));
  }

  requireModule(moduleId: CoreModuleId): void {
    if (!getModuleRegistry().isRegistered(moduleId)) {
      throw new Error(`Required module "${moduleId}" is not registered.`);
    }
    if (!this.isModuleEnabled(moduleId)) {
      throw new Error(`Required module "${moduleId}" is disabled by feature flags.`);
    }
  }
}

let applicationRegistryInstance: ApplicationRegistry | null = null;

export function getApplicationRegistry(featureFlags?: FeatureFlagEngine): ApplicationRegistry {
  if (!applicationRegistryInstance) {
    applicationRegistryInstance = new ApplicationRegistry(featureFlags);
  }
  return applicationRegistryInstance;
}

export function resetApplicationRegistry(): void {
  applicationRegistryInstance = null;
}

export function createApplicationRegistry(featureFlags?: FeatureFlagEngine): ApplicationRegistry {
  return new ApplicationRegistry(featureFlags);
}
