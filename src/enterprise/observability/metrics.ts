export interface MetricSnapshot {
  scope: string;
  requestCount: number;
  successCount: number;
  failureCount: number;
  totalDurationMs: number;
  lastDurationMs: number;
}

export class ClientMetricsCollector {
  private metrics = new Map<string, MetricSnapshot>();

  record(scope: string, outcome: 'success' | 'failure', durationMs: number): void {
    const current = this.metrics.get(scope) ?? {
      scope,
      requestCount: 0,
      successCount: 0,
      failureCount: 0,
      totalDurationMs: 0,
      lastDurationMs: 0,
    };

    current.requestCount += 1;
    if (outcome === 'success') current.successCount += 1;
    else current.failureCount += 1;
    current.totalDurationMs += durationMs;
    current.lastDurationMs = durationMs;

    this.metrics.set(scope, current);
  }

  get(scope?: string): MetricSnapshot[] {
    if (scope) {
      const snapshot = this.metrics.get(scope);
      return snapshot ? [snapshot] : [];
    }
    return Array.from(this.metrics.values());
  }

  averageDuration(scope: string): number {
    const snapshot = this.metrics.get(scope);
    if (!snapshot || snapshot.requestCount === 0) return 0;
    return Math.round(snapshot.totalDurationMs / snapshot.requestCount);
  }
}

let collector: ClientMetricsCollector | null = null;

export function getClientMetricsCollector(): ClientMetricsCollector {
  if (!collector) collector = new ClientMetricsCollector();
  return collector;
}

export interface StructuredLogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  scope: string;
  message: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export function createStructuredLog(
  level: StructuredLogEntry['level'],
  scope: string,
  message: string,
  meta?: Record<string, unknown>,
): StructuredLogEntry {
  return { level, scope, message, meta, timestamp: new Date().toISOString() };
}

export function emitStructuredLog(entry: StructuredLogEntry): void {
  const line = JSON.stringify(entry);
  if (entry.level === 'error') console.error(line);
  else if (entry.level === 'warn') console.warn(line);
  else console.log(line);
}

export async function measureAsync<T>(
  scope: string,
  fn: () => Promise<T>,
): Promise<T> {
  const startedAt = Date.now();
  const metrics = getClientMetricsCollector();
  try {
    const result = await fn();
    metrics.record(scope, 'success', Date.now() - startedAt);
    return result;
  } catch (error) {
    metrics.record(scope, 'failure', Date.now() - startedAt);
    throw error;
  }
}
