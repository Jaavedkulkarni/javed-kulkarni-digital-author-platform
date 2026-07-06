/**
 * AuthorOS Core Integration Layer
 * Connects authentication, CMS, storage, and platform services.
 * No UI screens. No routing changes. No Reader integration.
 */

export * from './types';
export * from './constants';
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
