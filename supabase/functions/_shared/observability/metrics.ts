import type { Logger } from '../logging/logger.ts';

export interface MetricSnapshot {
  functionName: string;
  requestCount: number;
  successCount: number;
  failureCount: number;
  totalDurationMs: number;
  lastDurationMs: number;
}

const metrics = new Map<string, MetricSnapshot>();

export function recordRequestMetric(
  functionName: string,
  outcome: 'success' | 'failure',
  durationMs: number,
  logger: Logger,
): void {
  const current = metrics.get(functionName) ?? {
    functionName,
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

  metrics.set(functionName, current);

  logger.info('Request metric', {
    functionName,
    outcome,
    durationMs,
    requestCount: current.requestCount,
    successCount: current.successCount,
    failureCount: current.failureCount,
  });
}

export function getMetrics(functionName?: string): MetricSnapshot[] {
  if (functionName) {
    const snapshot = metrics.get(functionName);
    return snapshot ? [snapshot] : [];
  }
  return Array.from(metrics.values());
}

export function averageDuration(snapshot: MetricSnapshot): number {
  if (snapshot.requestCount === 0) return 0;
  return Math.round(snapshot.totalDurationMs / snapshot.requestCount);
}
