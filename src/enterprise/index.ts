import { ARCHITECTURE_VERSION } from '../core/constants';

/**
 * Enterprise layer — re-exports frozen AuthorOS Core v1.0.0 contracts.
 * Business modules should prefer `@/core` for constants, errors, and types.
 */

export {
  ARCHITECTURE_VERSION,
  CORE_ARCHITECTURE_NAME,
  ENTERPRISE_FEATURE_FLAGS,
  DEFAULT_ENTERPRISE_FLAG_STATE,
  type EnterpriseFeatureFlagId,
  STORAGE_BUCKETS,
  CACHE_KEYS,
  DOMAIN_EVENT_NAMES,
  type DomainEventName,
  REQUEST_HEADERS,
  SYSTEM_LIMITS,
  PAGINATION_DEFAULTS,
} from '../core/constants';

export { CACHE_KEYS as enterpriseCacheKeys } from '../core/constants/cache.constants';

export {
  ERROR_CATALOG,
  createCatalogError,
  resolveErrorContract,
  type ErrorCatalogCode,
  type ErrorContract,
} from '../core/errors';

export {
  CURRENT_API_VERSION,
  getVersionHeader,
  wrapApiResponse,
  type ApiVersion,
} from '../core/versioning';

export { runFoundationValidation, assertFoundationValid } from '../core/validation';

export * from './request-context/request-context';
export * from './events/domain-event-bus';
export * from './events/domain-events';
export * from './feature-flags/feature-flag.service';
export * from './feature-flags/enterprise-flags';
export * from './avatars/avatar.types';
export * from './avatars/avatar.service';
export * from './temp-password/temp-password';
export * from './cache/cache-invalidation';
export * from './config/enterprise-config';
export * from './secrets/secrets.manager';
export * from './storage/file-storage.service';
export * from './audit/audit.types';
export * from './audit/audit.service';
export * from './activity/activity.types';
export * from './activity/activity.service';
export * from './jobs/job.types';
export * from './notifications/notification-engine';
export * from './email-templates/template-engine';
export * from './webhooks/webhook.types';
export * from './locks/lock.service';
export * from './observability/metrics';
export * from './health/health.service';
export * from './security/sanitize';
export * from './permissions/permission-guard';
export { createIdempotencyKey, resolveIdempotencyKey } from './idempotency/idempotency-key';
export * from './rate-limit/rate-limit.config';
export * from './multi-tenant/multi-tenant.types';
export * from './plugins/plugin.types';

export const ENTERPRISE_FOUNDATION_VERSION = ARCHITECTURE_VERSION;
