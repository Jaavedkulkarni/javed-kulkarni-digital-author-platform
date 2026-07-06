import { createContext } from 'react';
import type { CoreFoundation } from '../types/container.types';
import type { ConfigurationService } from '../config/configurationService';
import type { PermissionEngine } from '../permissions/permissionEngine';
import type { FeatureFlagEngine } from '../feature-flags/featureFlagEngine';
import type { EventBus } from '../events/eventBus';
import type { ModuleRegistry } from '../services/moduleRegistry';
import type { ApplicationRegistry } from '../services/applicationRegistry';
import type { DependencyContainer } from '../services/dependencyContainer';
import type { GlobalErrorHandler } from '../services/globalErrorHandler';

export interface CoreContextValue {
  foundation: CoreFoundation;
  config: ConfigurationService;
  permissions: PermissionEngine;
  featureFlags: FeatureFlagEngine;
  events: EventBus;
  modules: ModuleRegistry;
  applications: ApplicationRegistry;
  container: DependencyContainer;
  errors: GlobalErrorHandler;
}

export const CoreContext = createContext<CoreContextValue | null>(null);
