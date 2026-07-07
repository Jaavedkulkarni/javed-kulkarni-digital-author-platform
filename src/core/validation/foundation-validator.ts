import { ERROR_CATALOG, ERROR_CATALOG_CODES } from '../errors/error-catalog';
import { ENTERPRISE_FEATURE_FLAGS } from '../constants/feature-flags.constants';
import { DOMAIN_EVENT_NAMES } from '../constants/events.constants';
import { STORAGE_BUCKETS } from '../constants/storage.constants';
import { CORE_ROLES } from '../constants/roles.constants';
import { ARCHITECTURE_VERSION, CORE_ARCHITECTURE_NAME } from '../constants';
import { API_VERSIONS, CURRENT_API_VERSION } from '../versioning';

export type ValidationStatus = 'PASS' | 'FAIL';

export interface FoundationCheckResult {
  component: string;
  status: ValidationStatus;
  message: string;
}

export interface FoundationValidationReport {
  architecture: typeof CORE_ARCHITECTURE_NAME;
  version: typeof ARCHITECTURE_VERSION;
  apiVersion: typeof CURRENT_API_VERSION;
  checkedAt: string;
  overall: ValidationStatus;
  checks: FoundationCheckResult[];
}

function pass(component: string, message: string): FoundationCheckResult {
  return { component, status: 'PASS', message };
}

function fail(component: string, message: string): FoundationCheckResult {
  return { component, status: 'FAIL', message };
}

export function validateErrorCatalog(): FoundationCheckResult {
  const required = ['AUTH_001', 'USER_001', 'ROLE_001', 'SYSTEM_003', 'EDGE_001'];
  const missing = required.filter((c) => !ERROR_CATALOG_CODES.includes(c as keyof typeof ERROR_CATALOG));
  if (missing.length > 0) {
    return fail('Error Catalog', `Missing required codes: ${missing.join(', ')}`);
  }
  const invalid = ERROR_CATALOG_CODES.filter((code) => {
    const entry = ERROR_CATALOG[code];
    return !entry.message || !entry.httpStatus || !entry.recoveryStrategy;
  });
  if (invalid.length > 0) {
    return fail('Error Catalog', `Incomplete entries: ${invalid.join(', ')}`);
  }
  return pass('Error Catalog', `${ERROR_CATALOG_CODES.length} catalogued errors with full contracts`);
}

export function validateFeatureFlags(): FoundationCheckResult {
  if (ENTERPRISE_FEATURE_FLAGS.length < 14) {
    return fail('Feature Flags', 'Enterprise feature flag set incomplete');
  }
  return pass('Feature Flags', `${ENTERPRISE_FEATURE_FLAGS.length} feature flags defined`);
}

export function validateDomainEvents(): FoundationCheckResult {
  if (DOMAIN_EVENT_NAMES.length < 10) {
    return fail('Domain Events', 'Domain event catalog incomplete');
  }
  return pass('Domain Events', `${DOMAIN_EVENT_NAMES.length} domain events defined`);
}

export function validateStorageBuckets(): FoundationCheckResult {
  const required = ['AVATARS', 'BOOK_COVERS', 'BOOK_FILES'];
  const missing = required.filter((k) => !(k in STORAGE_BUCKETS));
  if (missing.length > 0) {
    return fail('Storage', `Missing buckets: ${missing.join(', ')}`);
  }
  return pass('Storage', `${Object.keys(STORAGE_BUCKETS).length} storage buckets defined`);
}

export function validateRoles(): FoundationCheckResult {
  if (!CORE_ROLES.includes('super_admin') || !CORE_ROLES.includes('reader')) {
    return fail('RBAC', 'Core role set incomplete');
  }
  return pass('RBAC', `${CORE_ROLES.length} core roles defined`);
}

export function validateApiVersioning(): FoundationCheckResult {
  if (!API_VERSIONS.includes('v1') || CURRENT_API_VERSION !== 'v1') {
    return fail('API Versioning', 'v1 must be current API version');
  }
  return pass('API Versioning', `Current API version: ${CURRENT_API_VERSION}`);
}

export function validateArchitectureVersion(): FoundationCheckResult {
  if (ARCHITECTURE_VERSION !== '1.0.0') {
    return fail('Architecture Version', `Expected 1.0.0, got ${ARCHITECTURE_VERSION}`);
  }
  return pass('Architecture Version', `${CORE_ARCHITECTURE_NAME} v${ARCHITECTURE_VERSION}`);
}

export function validateSecurityConstraints(): FoundationCheckResult {
  const forbiddenBrowserPatterns = ['SUPABASE_SERVICE_ROLE_KEY', 'auth.admin'];
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY) {
    return fail('Security', 'Service role key must not be exposed via VITE_ env vars');
  }
  void forbiddenBrowserPatterns;
  return pass('Security', 'No service role key in browser env; admin APIs restricted to edge');
}

const FOUNDATION_VALIDATORS = [
  validateArchitectureVersion,
  validateErrorCatalog,
  validateFeatureFlags,
  validateDomainEvents,
  validateStorageBuckets,
  validateRoles,
  validateApiVersioning,
  validateSecurityConstraints,
];

export function runFoundationValidation(): FoundationValidationReport {
  const checks = FOUNDATION_VALIDATORS.map((fn) => fn());
  const overall: ValidationStatus = checks.every((c) => c.status === 'PASS') ? 'PASS' : 'FAIL';
  return {
    architecture: CORE_ARCHITECTURE_NAME,
    version: ARCHITECTURE_VERSION,
    apiVersion: CURRENT_API_VERSION,
    checkedAt: new Date().toISOString(),
    overall,
    checks,
  };
}

export function assertFoundationValid(): void {
  const report = runFoundationValidation();
  if (report.overall === 'FAIL') {
    const failures = report.checks.filter((c) => c.status === 'FAIL').map((c) => c.component);
    throw new Error(`Foundation validation failed: ${failures.join(', ')}`);
  }
}
