import type { CoreFeatureFlag } from './featureFlag.types';
import type { LogLevel } from '../../lib/utils/logger';

export interface CoreEnvironmentConfig {
  appName: string;
  appVersion: string;
  environment: 'development' | 'staging' | 'production';
  logLevel: LogLevel;
  auditLoggingEnabled: boolean;
  featureFlags: Partial<Record<CoreFeatureFlag, boolean>>;
}

export interface CoreRuntimeConfig extends CoreEnvironmentConfig {
  initializedAt: string;
}
