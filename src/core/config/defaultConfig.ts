import type { CoreEnvironmentConfig } from '../types/config.types';
import type { CoreFeatureFlag } from '../types/featureFlag.types';
import type { LogLevel } from '../../lib/utils/logger';
import { APP_NAME, APP_VERSION } from '../constants/app.constants';
import { DEFAULT_FEATURE_FLAGS } from '../feature-flags/defaultFlags';

function readEnv(key: string): string | undefined {
  return import.meta.env[key] as string | undefined;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
}

function parseLogLevel(value: string | undefined): LogLevel {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'silent'];
  if (value && levels.includes(value as LogLevel)) {
    return value as LogLevel;
  }
  return import.meta.env.DEV ? 'info' : 'warn';
}

function parseEnvironment(): CoreEnvironmentConfig['environment'] {
  const value = readEnv('VITE_APP_ENV');
  if (value === 'staging' || value === 'production' || value === 'development') {
    return value;
  }
  return import.meta.env.PROD ? 'production' : 'development';
}

function parseFeatureFlags(): Partial<Record<CoreFeatureFlag, boolean>> {
  const flags: Partial<Record<CoreFeatureFlag, boolean>> = {};

  for (const definition of DEFAULT_FEATURE_FLAGS) {
    const envKey = `VITE_FEATURE_${definition.id.replace(/-/g, '_').toUpperCase()}`;
    flags[definition.id] = parseBoolean(readEnv(envKey), definition.defaultEnabled);
  }

  return flags;
}

export function loadDefaultConfig(): CoreEnvironmentConfig {
  return {
    appName: readEnv('VITE_APP_NAME') ?? APP_NAME,
    appVersion: readEnv('VITE_APP_VERSION') ?? APP_VERSION,
    environment: parseEnvironment(),
    logLevel: parseLogLevel(readEnv('VITE_LOG_LEVEL')),
    auditLoggingEnabled: parseBoolean(readEnv('VITE_AUDIT_LOGGING'), true),
    featureFlags: parseFeatureFlags(),
  };
}
