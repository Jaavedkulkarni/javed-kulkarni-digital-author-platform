import type { CoreEnvironmentConfig } from '../types/config.types';
import type { CoreFoundation } from '../types/container.types';
import { createConfigurationService } from '../config/configurationService';
import { createPermissionEngine } from '../permissions/permissionEngine';
import { createFeatureFlagEngine } from '../feature-flags/featureFlagEngine';
import { createEventBus } from '../events/eventBus';
import { createModuleRegistry } from '../services/moduleRegistry';
import { createApplicationRegistry } from '../services/applicationRegistry';
import { createServiceContainer } from '../services/dependencyContainer';
import { createGlobalErrorHandler } from '../services/globalErrorHandler';
import { globalLogger } from '../services/globalLogger';
import { CORE_LOG_SCOPES } from '../constants/app.constants';

export interface CoreBootstrapResult {
  foundation: CoreFoundation;
  config: ReturnType<typeof createConfigurationService>;
  permissions: ReturnType<typeof createPermissionEngine>;
  featureFlags: ReturnType<typeof createFeatureFlagEngine>;
  events: ReturnType<typeof createEventBus>;
  modules: ReturnType<typeof createModuleRegistry>;
  applications: ReturnType<typeof createApplicationRegistry>;
  container: ReturnType<typeof createServiceContainer>;
  errors: ReturnType<typeof createGlobalErrorHandler>;
}

export interface CreateCoreFoundationOptions {
  config?: Partial<CoreEnvironmentConfig>;
  autoInitializeModules?: boolean;
}

export function createCoreFoundation(
  options: CreateCoreFoundationOptions = {}
): CoreBootstrapResult {
  const config = createConfigurationService(options.config);
  const permissions = createPermissionEngine();
  const featureFlags = createFeatureFlagEngine(config);
  const events = createEventBus();
  const modules = createModuleRegistry();
  const applications = createApplicationRegistry(featureFlags);
  const container = createServiceContainer();
  const errors = createGlobalErrorHandler();

  modules.registerDefaults();

  if (options.autoInitializeModules ?? true) {
    void modules.initializeAll().catch((error) => {
      errors.handle(error, {
        scope: CORE_LOG_SCOPES.app,
        operation: 'core.bootstrap.initializeModules',
      });
    });
  }

  const foundation: CoreFoundation = {
    container,
    config: config.getConfig(),
  };

  globalLogger.info(CORE_LOG_SCOPES.app, 'Core foundation created', {
    environment: foundation.config.environment,
    modules: modules.getAll().map((module) => module.id),
  });

  return {
    foundation,
    config,
    permissions,
    featureFlags,
    events,
    modules,
    applications,
    container,
    errors,
  };
}

let cachedFoundation: CoreBootstrapResult | null = null;

export function getCoreFoundation(options?: CreateCoreFoundationOptions): CoreBootstrapResult {
  if (!cachedFoundation) {
    cachedFoundation = createCoreFoundation(options);
  }
  return cachedFoundation;
}

export function resetCoreFoundation(): void {
  cachedFoundation = null;
}
