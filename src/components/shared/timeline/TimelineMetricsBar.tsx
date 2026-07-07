import { memo } from 'react';
import type { TimelineMetrics } from '../../../enterprise/timeline';

interface TimelineMetricsBarProps {
  metrics: TimelineMetrics | null;
  renderTimeMs?: number;
}

export const TimelineMetricsBar = memo(function TimelineMetricsBar({
  metrics,
  renderTimeMs,
}: TimelineMetricsBarProps) {
  if (!metrics) return null;

  return (
    <div
      className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-navy-700/80 bg-navy-900/40 px-3 py-2 text-[10px] text-gray-500"
      aria-live="polite"
      aria-label="Timeline performance metrics"
    >
      <span>Query {metrics.queryTimeMs}ms</span>
      {typeof metrics.edgeTimeMs === 'number' ? <span>Edge {metrics.edgeTimeMs}ms</span> : null}
      {typeof renderTimeMs === 'number' ? <span>Render {renderTimeMs}ms</span> : null}
      <span>Records {metrics.recordsReturned}</span>
      <span>{metrics.cacheHit ? 'Cache hit' : 'Cache miss'}</span>
    </div>
  );
});

export default TimelineMetricsBar;
