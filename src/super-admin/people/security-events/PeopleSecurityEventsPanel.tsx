import { memo, useCallback, useMemo, useState } from 'react';
import type { SecurityEventItem, TimelineDetailPayload, TimelineExportFormat, TimelineFilters } from '../../../enterprise/timeline';
import { formatActivityEventTime } from '../../../enterprise/activity/activity-grouping';
import { EventDetailDrawer } from '../../../components/shared/timeline/EventDetailDrawer';
import { InfiniteTimelineList } from '../../../components/shared/timeline/InfiniteTimelineList';
import { RiskBadge } from '../../../components/shared/timeline/RiskBadge';
import { TimelinePanelShell } from '../../../components/shared/timeline/TimelinePanelShell';
import { SECURITY_EVENT_TYPE_OPTIONS } from '../timeline/timeline.constants';
import { exportPeopleTimeline } from '../timeline/timeline-export';
import { usePeopleSecurityEvents } from '../timeline/timeline.hooks';

interface PeopleSecurityEventsPanelProps {
  userId: string;
}

const DEFAULT_FILTERS: TimelineFilters = {
  search: '',
  severity: '',
  eventType: '',
  dateFrom: '',
  dateTo: '',
};

function toDetailPayload(item: SecurityEventItem): TimelineDetailPayload {
  return {
    id: item.id,
    kind: 'security',
    title: item.title,
    description: item.description,
    actorId: item.actorId,
    actorLabel: item.actorLabel,
    targetId: item.targetId,
    targetLabel: null,
    createdAt: item.createdAt,
    severity: item.severity,
    requestId: item.requestId,
    traceId: item.traceId,
    correlationId: item.correlationId,
    metadata: item.metadata,
  };
}

export const PeopleSecurityEventsPanel = memo(function PeopleSecurityEventsPanel({
  userId,
}: PeopleSecurityEventsPanelProps) {
  const [filters, setFilters] = useState<TimelineFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<TimelineDetailPayload | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [renderStartedAt] = useState(() => performance.now());

  const query = usePeopleSecurityEvents(userId, filters);
  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const metrics = query.data?.pages[query.data.pages.length - 1]?.metrics ?? null;

  const handleExport = useCallback(
    async (format: TimelineExportFormat) => {
      setIsExporting(true);
      try {
        await exportPeopleTimeline('security-events', userId, format, filters);
      } finally {
        setIsExporting(false);
      }
    },
    [filters, userId],
  );

  return (
    <>
      <TimelinePanelShell
        title="Security Events"
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
        isExporting={isExporting}
        metrics={metrics}
        renderTimeMs={Math.round(performance.now() - renderStartedAt)}
        eventTypeOptions={SECURITY_EVENT_TYPE_OPTIONS}
      >
        <InfiniteTimelineList
          items={items}
          getItemKey={(item) => item.id}
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          onLoadMore={() => void query.fetchNextPage()}
          isLoading={query.isLoading}
          isError={query.isError}
          errorMessage={query.error?.message}
          emptyMessage="No security events for this user yet."
          ariaLabel="Security events"
          renderItem={(item) => (
            <button
              type="button"
              onClick={() => setSelected(toDetailPayload(item))}
              className="flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-navy-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400/50"
              aria-label={`View security event ${item.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-100">{item.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {item.actorLabel ?? item.actorId ?? 'System'}
                  </p>
                </div>
                <RiskBadge severity={item.severity} />
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500">
                <span>{formatActivityEventTime(item.createdAt)}</span>
                <span className="uppercase">{item.eventType.replace(/_/g, ' ')}</span>
              </div>
            </button>
          )}
        />
      </TimelinePanelShell>

      <EventDetailDrawer payload={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
});

export default PeopleSecurityEventsPanel;
