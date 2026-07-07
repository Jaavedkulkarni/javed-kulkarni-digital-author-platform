import { memo, useCallback, useMemo, useState } from 'react';
import type { TimelineDetailPayload, TimelineExportFormat, TimelineFilters } from '../../../enterprise/timeline';
import type { ActivityTimelineEvent } from '../../../enterprise/activity/activity-grouping';
import { classifyAuditSeverity } from '../../../enterprise/timeline';
import { GroupedEventTimeline } from '../../../components/shared/timeline/GroupedEventTimeline';
import { EventDetailDrawer } from '../../../components/shared/timeline/EventDetailDrawer';
import { TimelinePanelShell } from '../../../components/shared/timeline/TimelinePanelShell';
import { exportPeopleTimeline } from '../timeline/timeline-export';
import { usePeopleActivityTimeline } from '../timeline/timeline.hooks';

interface PeopleActivityPanelProps {
  userId: string;
}

const DEFAULT_FILTERS: TimelineFilters = {
  search: '',
  severity: '',
  dateFrom: '',
  dateTo: '',
};

function toDetailPayload(event: ActivityTimelineEvent): TimelineDetailPayload {
  const metadata = (event.metadata ?? {}) as Record<string, unknown>;
  return {
    id: event.id,
    kind: 'activity',
    title: event.title,
    description: event.description ?? null,
    actorId: typeof metadata.actorId === 'string' ? metadata.actorId : null,
    actorLabel: null,
    targetId: typeof metadata.targetId === 'string' ? metadata.targetId : null,
    targetLabel: null,
    createdAt: event.createdAt,
    severity: classifyAuditSeverity(event.activityType ?? '', metadata),
    requestId: typeof metadata.requestId === 'string' ? metadata.requestId : null,
    traceId: typeof metadata.traceId === 'string' ? metadata.traceId : null,
    correlationId: typeof metadata.correlationId === 'string' ? metadata.correlationId : null,
    metadata,
  };
}

export const PeopleActivityPanel = memo(function PeopleActivityPanel({ userId }: PeopleActivityPanelProps) {
  const [filters, setFilters] = useState<TimelineFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<TimelineDetailPayload | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [renderStartedAt] = useState(() => performance.now());

  const query = usePeopleActivityTimeline(userId, filters);
  const events = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const metrics = query.data?.pages[query.data.pages.length - 1]?.metrics ?? null;

  const handleExport = useCallback(
    async (format: TimelineExportFormat) => {
      setIsExporting(true);
      try {
        await exportPeopleTimeline('activity', userId, format, filters);
      } finally {
        setIsExporting(false);
      }
    },
    [filters, userId],
  );

  return (
    <>
      <TimelinePanelShell
        title="Activity Timeline"
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
        isExporting={isExporting}
        metrics={metrics}
        renderTimeMs={Math.round(performance.now() - renderStartedAt)}
      >
        <GroupedEventTimeline
          events={events}
          isLoading={query.isLoading}
          isError={query.isError}
          errorMessage={query.error?.message}
          emptyMessage="No activity events for this user yet."
          onEventClick={(event) => setSelected(toDetailPayload(event))}
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          onLoadMore={() => void query.fetchNextPage()}
        />
      </TimelinePanelShell>

      <EventDetailDrawer payload={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
});

export default PeopleActivityPanel;
