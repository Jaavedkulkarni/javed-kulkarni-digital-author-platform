import { ValidationError } from '../errors/app-error.ts';

export interface TimelineListRequest {
  action: 'list' | 'export';
  userId: string;
  cursor?: string | null;
  limit?: number;
  search?: string;
  severity?: string;
  actionFilter?: string;
  eventType?: string;
  dateFrom?: string;
  dateTo?: string;
  exportFormat?: 'csv' | 'xlsx' | 'pdf' | 'json';
}

const ACTIONS = new Set(['list', 'export']);

export function validateTimelineListRequest(body: unknown): TimelineListRequest {
  if (!body || typeof body !== 'object') throw new ValidationError('Request body is required');
  const input = body as Record<string, unknown>;
  if (typeof input.action !== 'string' || !ACTIONS.has(input.action)) {
    throw new ValidationError('Invalid timeline action');
  }
  if (typeof input.userId !== 'string' || !input.userId.trim()) {
    throw new ValidationError('userId is required');
  }

  return {
    action: input.action as TimelineListRequest['action'],
    userId: input.userId.trim(),
    cursor: typeof input.cursor === 'string' ? input.cursor : null,
    limit: typeof input.limit === 'number' ? Math.min(Math.max(input.limit, 1), 100) : 25,
    search: typeof input.search === 'string' ? input.search.trim() : '',
    severity: typeof input.severity === 'string' ? input.severity.trim() : '',
    actionFilter: typeof input.actionFilter === 'string' ? input.actionFilter.trim() : '',
    eventType: typeof input.eventType === 'string' ? input.eventType.trim() : '',
    dateFrom: typeof input.dateFrom === 'string' ? input.dateFrom.trim() : '',
    dateTo: typeof input.dateTo === 'string' ? input.dateTo.trim() : '',
    exportFormat: typeof input.exportFormat === 'string'
      ? input.exportFormat as TimelineListRequest['exportFormat']
      : 'json',
  };
}

export function parseOperatingSystem(userAgent: string | null | undefined, platform: string | null | undefined): string | null {
  const ua = userAgent ?? '';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac OS/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return platform ?? null;
}

export function parseDevice(userAgent: string | null | undefined): string | null {
  const ua = userAgent ?? '';
  if (/Mobile/i.test(ua)) return 'Mobile';
  if (/Tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

const SENSITIVE_KEY_PATTERN =
  /password|token|secret|recovery|mfa|api[_-]?key|service[_-]?key|authorization|credential|private/i;

export function maskSensitiveData<T>(input: T): T {
  if (Array.isArray(input)) return input.map((item) => maskSensitiveData(item)) as T;
  if (input && typeof input === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        result[key] = '••••••••';
      } else if (value && typeof value === 'object') {
        result[key] = maskSensitiveData(value);
      } else {
        result[key] = value;
      }
    }
    return result as T;
  }
  return input;
}

export function buildCursorPage<T extends { createdAt: string }>(
  rows: T[],
  limit: number,
): { items: T[]; nextCursor: string | null } {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1]?.createdAt ?? null : null;
  return { items, nextCursor };
}

export async function resolveProfileLabel(
  adminClient: ReturnType<typeof import('../auth/context.ts').createAdminClient>,
  userId: string | null | undefined,
): Promise<string | null> {
  if (!userId) return null;
  const { data } = await adminClient.from('profiles').select('full_name, email').eq('id', userId).maybeSingle();
  if (!data) return userId.slice(0, 8);
  return (data.full_name as string | null) ?? (data.email as string | null) ?? userId.slice(0, 8);
}
