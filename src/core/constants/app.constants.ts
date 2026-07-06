export const APP_NAME = 'AuthorOS';
export const APP_VERSION = '1.0.0';
export const CORE_SCOPE = 'core';

export const CORE_LOG_SCOPES = {
  app: 'core:app',
  permissions: 'core:permissions',
  features: 'core:features',
  events: 'core:events',
  audit: 'core:audit',
  config: 'core:config',
  container: 'core:container',
  registry: 'core:registry',
} as const;

export const AUDIT_ACTIONS = {
  permissionDenied: 'permission.denied',
  permissionGranted: 'permission.granted',
  featureToggled: 'feature.toggled',
  moduleRegistered: 'module.registered',
  moduleInitialized: 'module.initialized',
  eventEmitted: 'event.emitted',
  errorHandled: 'error.handled',
} as const;
