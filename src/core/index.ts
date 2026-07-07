/**
 * AuthorOS Core Integration Layer v1.0.0 — FROZEN
 * Connects authentication, enterprise foundation, and platform services.
 * Business modules must import from @/core — not redefine patterns.
 */

export * from './types';
export * from './constants';
export * from './enums';
export * from './interfaces';
export * from './errors';
export * from './versioning';
export * from './validation';
export * from './config';
export * from './permissions';
export * from './feature-flags';
export * from './events';
export * from './services';
export * from './utils';
export * from './navigation';
export * from './contexts';
export * from './providers';
export * from './hooks';
export * from './app';

export {
  createCoreFoundation,
  getCoreFoundation,
  resetCoreFoundation,
  type CoreBootstrapResult,
  type CreateCoreFoundationOptions,
} from './app';

export {
  AppProvider,
  PermissionProvider,
  FeatureFlagProvider,
} from './providers';

export {
  getServiceContainer,
  getModuleRegistry,
  getApplicationRegistry,
  getGlobalErrorHandler,
} from './services';

export { getEventBus } from './events';
export { getConfigurationService } from './config';
export { getPermissionEngine } from './permissions';
export { getFeatureFlagEngine } from './feature-flags';

export { ARCHITECTURE_VERSION, CORE_ARCHITECTURE_NAME } from './constants';
export { runFoundationValidation, assertFoundationValid } from './validation';
