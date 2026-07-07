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
  functionName: string;
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

function headerValue(req: Request, name: string): string | null {
  const value = req.headers.get(name);
  return value?.trim() || null;
}

function parseUserAgent(userAgent: string | null): { browser: string | null; device: string | null; platform: string | null } {
  if (!userAgent) {
    return { browser: null, device: null, platform: null };
  }

  const ua = userAgent.toLowerCase();
  let browser = 'Unknown';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome/')) browser = 'Chrome';
  else if (ua.includes('firefox/')) browser = 'Firefox';
  else if (ua.includes('safari/') && !ua.includes('chrome')) browser = 'Safari';

  let platform = 'Unknown';
  if (ua.includes('windows')) platform = 'Windows';
  else if (ua.includes('mac os')) platform = 'macOS';
  else if (ua.includes('linux')) platform = 'Linux';
  else if (ua.includes('android')) platform = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) platform = 'iOS';

  let device = 'Desktop';
  if (ua.includes('mobile')) device = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';

  return { browser, device, platform };
}

export function buildRequestContext(req: Request, functionName: string): RequestContext {
  const userAgent = headerValue(req, 'user-agent');
  const parsed = parseUserAgent(userAgent);
  const forwarded = headerValue(req, 'x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? headerValue(req, 'cf-connecting-ip');

  return {
    requestId: headerValue(req, REQUEST_ID_HEADER) ?? generateRequestId(),
    traceId: headerValue(req, TRACE_ID_HEADER) ?? generateTraceId(),
    correlationId: headerValue(req, CORRELATION_ID_HEADER) ?? generateCorrelationId(),
    spanId: headerValue(req, SPAN_ID_HEADER) ?? generateSpanId(),
    ip,
    browser: parsed.browser,
    device: headerValue(req, DEVICE_HEADER) ?? parsed.device,
    platform: headerValue(req, PLATFORM_HEADER) ?? parsed.platform,
    timezone: headerValue(req, TIMEZONE_HEADER),
    locale: headerValue(req, LOCALE_HEADER) ?? headerValue(req, 'accept-language')?.split(',')[0] ?? null,
    userAgent,
    actorId: null,
    actorRole: null,
    permissions: [],
    functionName,
    startedAt: new Date().toISOString(),
  };
}

export function attachActorToContext(
  context: RequestContext,
  actorId: string,
  actorRole: string | null,
  permissions: string[] = [],
): RequestContext {
  return { ...context, actorId, actorRole, permissions };
}

export function contextResponseHeaders(context: RequestContext): Record<string, string> {
  return {
    [REQUEST_ID_HEADER]: context.requestId,
    [TRACE_ID_HEADER]: context.traceId,
    [CORRELATION_ID_HEADER]: context.correlationId,
    [SPAN_ID_HEADER]: context.spanId,
  };
}
