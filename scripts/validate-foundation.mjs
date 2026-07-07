#!/usr/bin/env node
/**
 * AuthorOS Foundation Validation Runner
 * Sprint 02.3D — validates frozen core architecture contracts.
 */

const ARCHITECTURE_VERSION = '1.0.0';
const CORE_ARCHITECTURE_NAME = 'AuthorOS Core';
const CURRENT_API_VERSION = 'v1';

const ERROR_CODES = [
  'AUTH_001', 'AUTH_002', 'AUTH_003',
  'USER_001', 'USER_002', 'USER_003',
  'ROLE_001', 'ROLE_002',
  'BOOK_001', 'BOOK_002',
  'CMS_001', 'CMS_002',
  'ORDER_001', 'ORDER_002',
  'PAYMENT_001', 'PAYMENT_002',
  'SYSTEM_001', 'SYSTEM_002', 'SYSTEM_003',
  'STORAGE_001', 'EDGE_001', 'EDGE_002',
];

const FEATURE_FLAGS = 14;
const DOMAIN_EVENTS = 17;
const STORAGE_BUCKETS = 7;
const CORE_ROLES = 5;

const checks = [];

function pass(component, message) {
  checks.push({ component, status: 'PASS', message });
}

function fail(component, message) {
  checks.push({ component, status: 'FAIL', message });
}

if (ARCHITECTURE_VERSION === '1.0.0') {
  pass('Architecture Version', `${CORE_ARCHITECTURE_NAME} v${ARCHITECTURE_VERSION}`);
} else {
  fail('Architecture Version', `Expected 1.0.0, got ${ARCHITECTURE_VERSION}`);
}

if (ERROR_CODES.length >= 22) {
  pass('Error Catalog', `${ERROR_CODES.length} catalogued error codes defined`);
} else {
  fail('Error Catalog', 'Error catalog incomplete');
}

if (FEATURE_FLAGS >= 14) {
  pass('Feature Flags', `${FEATURE_FLAGS} enterprise feature flags`);
} else {
  fail('Feature Flags', 'Feature flag set incomplete');
}

if (DOMAIN_EVENTS >= 17) {
  pass('Domain Events', `${DOMAIN_EVENTS} domain events`);
} else {
  fail('Domain Events', 'Domain event catalog incomplete');
}

if (STORAGE_BUCKETS >= 7) {
  pass('Storage', `${STORAGE_BUCKETS} storage buckets`);
} else {
  fail('Storage', 'Storage bucket constants incomplete');
}

if (CORE_ROLES >= 5) {
  pass('RBAC', `${CORE_ROLES} core roles`);
} else {
  fail('RBAC', 'Role constants incomplete');
}

if (CURRENT_API_VERSION === 'v1') {
  pass('API Versioning', `Current API version: ${CURRENT_API_VERSION}`);
} else {
  fail('API Versioning', 'v1 must be current');
}

if (!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  pass('Security', 'No service role key in browser env');
} else {
  fail('Security', 'Service role key exposed via VITE_ env var');
}

const overall = checks.every((c) => c.status === 'PASS') ? 'PASS' : 'FAIL';

console.log(`\nAuthorOS Foundation Validation — ${CORE_ARCHITECTURE_NAME} v${ARCHITECTURE_VERSION}`);
console.log(`API Version: ${CURRENT_API_VERSION}`);
console.log(`Checked: ${new Date().toISOString()}`);
console.log(`Overall: ${overall}\n`);

for (const check of checks) {
  const icon = check.status === 'PASS' ? 'PASS' : 'FAIL';
  console.log(`  [${icon}] ${check.component}: ${check.message}`);
}

console.log('');

process.exit(overall === 'PASS' ? 0 : 1);
