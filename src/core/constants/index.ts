export { APP_NAME, APP_VERSION, CORE_SCOPE, CORE_LOG_SCOPES, AUDIT_ACTIONS } from './app.constants';
export { MODULE_DEFINITIONS, MODULE_BOOTSTRAP_ORDER } from './modules.constants';
export * from './roles.constants';
export * from './permissions.constants';
export * from './statuses.constants';
export * from './feature-flags.constants';
export * from './storage.constants';
export * from './cache.constants';
export * from './jobs.constants';
export * from './events.constants';
export * from './notifications.constants';
export * from './webhooks.constants';
export * from './system.constants';
export * from './validation.constants';

export const ARCHITECTURE_VERSION = '1.0.0' as const;
export const CORE_ARCHITECTURE_NAME = 'AuthorOS Core' as const;
