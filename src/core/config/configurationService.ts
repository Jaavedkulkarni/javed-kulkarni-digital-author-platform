import type { CoreEnvironmentConfig, CoreRuntimeConfig } from '../types/config.types';
import type { CoreFeatureFlag } from '../types/featureFlag.types';
import type { LogLevel } from '../../lib/utils/logger';
import { logger, setLogLevel } from '../../lib/utils/logger';
import { loadDefaultConfig } from './defaultConfig';
import { CORE_LOG_SCOPES } from '../constants/app.constants';

export class ConfigurationService {
  private config: CoreRuntimeConfig;

  constructor(initial?: Partial<CoreEnvironmentConfig>) {
    const defaults = loadDefaultConfig();
    this.config = {
      ...defaults,
      ...initial,
      featureFlags: { ...defaults.featureFlags, ...initial?.featureFlags },
      initializedAt: new Date().toISOString(),
    };
    setLogLevel(this.config.logLevel);
    logger.info(CORE_LOG_SCOPES.config, 'Configuration loaded', {
      environment: this.config.environment,
    });
  }

  getConfig(): Readonly<CoreRuntimeConfig> {
    return this.config;
  }

  getLogLevel(): LogLevel {
    return this.config.logLevel;
  }

  isAuditLoggingEnabled(): boolean {
    return this.config.auditLoggingEnabled;
  }

  getFeatureFlag(flag: CoreFeatureFlag): boolean | undefined {
    return this.config.featureFlags[flag];
  }

  setFeatureFlag(flag: CoreFeatureFlag, enabled: boolean): void {
    this.config = {
      ...this.config,
      featureFlags: { ...this.config.featureFlags, [flag]: enabled },
    };
  }

  update(partial: Partial<CoreEnvironmentConfig>): void {
    this.config = {
      ...this.config,
      ...partial,
      featureFlags: partial.featureFlags
        ? { ...this.config.featureFlags, ...partial.featureFlags }
        : this.config.featureFlags,
    };
    if (partial.logLevel) {
      setLogLevel(partial.logLevel);
    }
  }
}

let configurationInstance: ConfigurationService | null = null;

export function getConfigurationService(): ConfigurationService {
  if (!configurationInstance) {
    configurationInstance = new ConfigurationService();
  }
  return configurationInstance;
}

export function resetConfigurationService(): void {
  configurationInstance = null;
}

export function createConfigurationService(
  initial?: Partial<CoreEnvironmentConfig>
): ConfigurationService {
  return new ConfigurationService(initial);
}
