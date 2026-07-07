import { memo, useCallback, useMemo, useState } from 'react';
import type { AuditTimelineItem, TimelineExportFormat, TimelineFilters } from '../../../enterprise/timeline';
import { formatActivityEventTime } from '../../../enterprise/activity/activity-grouping';
import { AuditDetailDrawer } from '../../../components/shared/timeline/AuditDetailDrawer';
import { InfiniteTimelineList } from '../../../components/shared/timeline/InfiniteTimelineList';
import { RiskBadge } from '../../../components/shared/timeline/RiskBadge';
import { TimelinePanelShell } from '../../../components/shared/timeline/TimelinePanelShell';
import { AUDIT_ACTION_OPTIONS } from '../timeline/timeline.constants';
import { exportPeopleTimeline } from '../timeline/timeline-export';
import { usePeopleAuditTimeline } from '../timeline/timeline.hooks';

interface PeopleAuditPanelProps {
  userId: string;
}

const DEFAULT_FILTERS: TimelineFilters = {
  search: '',
  severity: '',
  action: '',
  dateFrom: '',
  dateTo: '',
};

export const PeopleAuditPanel = memo(function PeopleAuditPanel({ userId }: PeopleAuditPanelProps) {
  const [filters, setFilters] = useState<TimelineFilters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<AuditTimelineItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [renderStartedAt] = useState(() => performance.now());

  const query = usePeopleAuditTimeline(userId, filters);
  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const metrics = query.data?.pages[query.data.pages.length - 1]?.metrics ?? null;

  const handleExport = useCallback(
    async (format: TimelineExportFormat) => {
      setIsExporting(true);
      try {
        await exportPeopleTimeline('audit', userId, format, filters);
      } finally {
        setIsExporting(false);
      }
    },
    [filters, userId],
  );

  return (
    <>
      <TimelinePanelShell
        title="Audit Timeline"
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
        isExporting={isExporting}
        metrics={metrics}
        renderTimeMs={Math.round(performance.now() - renderStartedAt)}
        actionOptions={AUDIT_ACTION_OPTIONS}
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
          emptyMessage="No audit entries for this user yet."
          ariaLabel="Audit timeline"
          renderItem={(item) => (
            <button
              type="button"
              onClick={() => setSelected(item)}
              className="flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-navy-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400/50"
              aria-label={`View audit entry ${item.action}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-100">{item.action}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {item.actorLabel ?? item.actorId ?? 'System'} → {item.targetLabel ?? item.targetType ?? item.targetId ?? '—'}
                  </p>
                </div>
                <RiskBadge severity={item.severity} />
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500">
                <span>{formatActivityEventTime(item.createdAt)}</span>
                {item.browser ? <span>{item.browser}</span> : null}
                {item.operatingSystem ? <span>{item.operatingSystem}</span> : null}
                {item.ipAddress ? <span>{item.ipAddress}</span> : null}
              </div>
            </button>
          )}
        />
      </TimelinePanelShell>

      <AuditDetailDrawer item={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </>
  );
});

export default PeopleAuditPanel;
