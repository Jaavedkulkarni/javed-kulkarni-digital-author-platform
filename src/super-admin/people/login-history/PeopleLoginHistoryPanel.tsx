import { memo, useCallback, useMemo, useState } from 'react';
import type { LoginHistoryItem, TimelineDetailPayload, TimelineExportFormat, TimelineFilters } from '../../../enterprise/timeline';
import { formatActivityEventTime } from '../../../enterprise/activity/activity-grouping';
import { EventDetailDrawer } from '../../../components/shared/timeline/EventDetailDrawer';
import { InfiniteTimelineList } from '../../../components/shared/timeline/InfiniteTimelineList';
import { RiskBadge } from '../../../components/shared/timeline/RiskBadge';
import { TimelinePanelShell } from '../../../components/shared/timeline/TimelinePanelShell';
import { LOGIN_EVENT_TYPE_OPTIONS } from '../timeline/timeline.constants';
import { exportPeopleTimeline } from '../timeline/timeline-export';
import { usePeopleLoginHistory } from '../timeline/timeline.hooks';

interface PeopleLoginHistoryPanelProps {
  userId: string;
}

const DEFAULT_FILTERS: TimelineFilters = {
  search: '',
  severity: '',
  eventType: '',
  dateFrom: '',
  dateTo: '',
};

function toDetailPayload(item: LoginHistoryItem): TimelineDetailPayload {
  return {
    id: item.id,
    kind: 'login',
    title: item.title,
    description: item.description,
    actorId: null,
    actorLabel: null,
    targetId: null,
    targetLabel: null,
    createdAt: item.createdAt,
    severity: item.severity,
    requestId: null,
    traceId: null,
    correlationId: null,
    metadata: {
      ...item.metadata,
      browser: item.browser,
      operatingSystem: item.operatingSystem,
      device: item.device,
      country: item.country,
      region: item.region,
      ipAddress: item.ipAddress,
      eventType: item.eventType,
    },
  };
}

export const PeopleLoginHistoryPanel = memo(function PeopleLoginHistoryPanel({
  userId,
}: PeopleLoginHistoryPanelProps) {
  const [filters, setFilters] = useState<TimelineFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<TimelineDetailPayload | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [renderStartedAt] = useState(() => performance.now());

  const query = usePeopleLoginHistory(userId, filters);
  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const metrics = query.data?.pages[query.data.pages.length - 1]?.metrics ?? null;

  const handleExport = useCallback(
    async (format: TimelineExportFormat) => {
      setIsExporting(true);
      try {
        await exportPeopleTimeline('login-history', userId, format, filters);
      } finally {
        setIsExporting(false);
      }
    },
    [filters, userId],
  );

  return (
    <>
      <TimelinePanelShell
        title="Login History"
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
        isExporting={isExporting}
        metrics={metrics}
        renderTimeMs={Math.round(performance.now() - renderStartedAt)}
        eventTypeOptions={LOGIN_EVENT_TYPE_OPTIONS}
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
          emptyMessage="No login history for this user yet."
          ariaLabel="Login history"
          renderItem={(item) => (
            <button
              type="button"
              onClick={() => setSelected(toDetailPayload(item))}
              className="flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-navy-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400/50"
              aria-label={`View login event ${item.title}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-100">{item.title}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-gray-600">
                    {item.eventType.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <RiskBadge severity={item.severity} />
                  {item.isCurrentSession ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      Current session
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500">
                <span>{formatActivityEventTime(item.createdAt)}</span>
                {item.browser ? <span>{item.browser}</span> : null}
                {item.device ? <span>{item.device}</span> : null}
                {item.country ? <span>{item.country}</span> : null}
                {item.ipAddress ? <span>{item.ipAddress}</span> : null}
              </div>
            </button>
          )}
        />
      </TimelinePanelShell>

      <EventDetailDrawer payload={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
});

export default PeopleLoginHistoryPanel;
