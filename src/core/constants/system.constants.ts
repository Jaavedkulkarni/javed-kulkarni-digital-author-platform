export const SYSTEM_LIMITS = {
  maxPageSize: 100,
  defaultPageSize: 20,
  maxSearchLength: 200,
  maxNotesLength: 2000,
  maxAuditLogFetch: 100,
  maxActivityLogFetch: 100,
  idempotencyTtlHours: 24,
  rateLimitWindowSeconds: 60,
  distributedLockTtlMs: 30_000,
  tempPasswordTtlHours: 72,
  passwordMinLength: 12,
} as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: SYSTEM_LIMITS.defaultPageSize,
  maxPageSize: SYSTEM_LIMITS.maxPageSize,
} as const;

export const DATE_FORMATS = {
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  date: 'yyyy-MM-dd',
  display: 'dd MMM yyyy',
  displayWithTime: 'dd MMM yyyy HH:mm',
} as const;

export const REQUEST_HEADERS = {
  requestId: 'x-request-id',
  traceId: 'x-trace-id',
  correlationId: 'x-correlation-id',
  spanId: 'x-span-id',
  timezone: 'x-timezone',
  locale: 'x-locale',
  platform: 'x-platform',
  device: 'x-device',
  idempotencyKey: 'idempotency-key',
  apiVersion: 'x-api-version',
} as const;

export const SECURITY_HEADER_NAMES = {
  contentTypeOptions: 'X-Content-Type-Options',
  frameOptions: 'X-Frame-Options',
  referrerPolicy: 'Referrer-Policy',
} as const;
