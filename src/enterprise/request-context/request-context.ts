export interface RequestIdentifiers {
  requestId: string;
  traceId: string;
  correlationId: string;
  spanId: string;
}

export interface ClientEnvironment {
  ip: string | null;
  browser: string | null;
  device: string | null;
  platform: string | null;
  timezone: string | null;
  locale: string | null;
  userAgent: string | null;
}

export interface RequestContext extends RequestIdentifiers, ClientEnvironment {
  actorId: string | null;
  actorRole: string | null;
  permissions: string[];
  startedAt: string;
}

export const REQUEST_ID_HEADER = 'x-request-id';
export const TRACE_ID_HEADER = 'x-trace-id';
export const CORRELATION_ID_HEADER = 'x-correlation-id';
export const SPAN_ID_HEADER = 'x-span-id';
export const TIMEZONE_HEADER = 'x-timezone';
export const LOCALE_HEADER = 'x-locale';
export const PLATFORM_HEADER = 'x-platform';
export const DEVICE_HEADER = 'x-device';
export const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function generateTraceId(): string {
  return crypto.randomUUID();
}

export function generateCorrelationId(): string {
  return crypto.randomUUID();
}

export function generateSpanId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

export function detectPlatform(): string {
  if (typeof navigator === 'undefined') return 'server';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('mac')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
  return 'Unknown';
}

export function detectDevice(): string {
  if (typeof navigator === 'undefined') return 'server';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mobile')) return 'Mobile';
  if (ua.includes('tablet') || ua.includes('ipad')) return 'Tablet';
  return 'Desktop';
}

export function buildRequestContext(partial?: Partial<RequestContext>): RequestContext {
  const timezone = partial?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = partial?.locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en');
  const userAgent = partial?.userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : null);

  return {
    requestId: partial?.requestId ?? generateRequestId(),
    traceId: partial?.traceId ?? generateTraceId(),
    correlationId: partial?.correlationId ?? generateCorrelationId(),
    spanId: partial?.spanId ?? generateSpanId(),
    ip: partial?.ip ?? null,
    browser: partial?.browser ?? null,
    device: partial?.device ?? detectDevice(),
    platform: partial?.platform ?? detectPlatform(),
    timezone,
    locale,
    userAgent,
    actorId: partial?.actorId ?? null,
    actorRole: partial?.actorRole ?? null,
    permissions: partial?.permissions ?? [],
    startedAt: partial?.startedAt ?? new Date().toISOString(),
  };
}

export function buildEnterpriseRequestHeaders(
  context?: Partial<RequestContext>,
  idempotencyKey?: string,
): Record<string, string> {
  const ctx = buildRequestContext(context);
  const headers: Record<string, string> = {
    [REQUEST_ID_HEADER]: ctx.requestId,
    [TRACE_ID_HEADER]: ctx.traceId,
    [CORRELATION_ID_HEADER]: ctx.correlationId,
    [SPAN_ID_HEADER]: ctx.spanId,
    [TIMEZONE_HEADER]: ctx.timezone ?? '',
    [LOCALE_HEADER]: ctx.locale ?? '',
    [PLATFORM_HEADER]: ctx.platform ?? '',
    [DEVICE_HEADER]: ctx.device ?? '',
  };
  if (idempotencyKey) {
    headers[IDEMPOTENCY_KEY_HEADER] = idempotencyKey;
  }
  return headers;
}
