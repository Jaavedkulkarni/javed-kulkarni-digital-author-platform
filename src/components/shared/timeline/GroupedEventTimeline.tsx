import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import {
  DEFAULT_COLLAPSED_ACTIVITY_GROUPS,
  formatActivityEventTime,
  groupActivityEventsByTime,
  type ActivityTimeGroupKey,
  type ActivityTimelineEvent,
} from '../../../enterprise/activity/activity-grouping';

interface GroupedEventTimelineProps {
  events: ActivityTimelineEvent[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  defaultCollapsedGroups?: ActivityTimeGroupKey[];
  onEventClick?: (event: ActivityTimelineEvent) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export const GroupedEventTimeline = memo(function GroupedEventTimeline({
  events,
  isLoading = false,
  isError = false,
  errorMessage,
  emptyMessage = 'No activity recorded yet.',
  defaultCollapsedGroups = DEFAULT_COLLAPSED_ACTIVITY_GROUPS,
  onEventClick,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}: GroupedEventTimelineProps) {
  const sections = useMemo(() => groupActivityEventsByTime(events), [events]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState<Set<ActivityTimeGroupKey>>(
    () => new Set(defaultCollapsedGroups),
  );

  useEffect(() => {
    if (!hasNextPage || !onLoadMore || isFetchingNextPage) return undefined;
    const node = sentinelRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { rootMargin: '120px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  const toggleGroup = useCallback((key: ActivityTimeGroupKey) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => setCollapsed(new Set()), []);
  const collapseAll = useCallback(() => {
    setCollapsed(new Set(sections.map((section) => section.key)));
  }, [sections]);

  if (isLoading) {
    return <p className="text-sm text-gray-400">Loading activity…</p>;
  }

  if (isError) {
    return <p className="text-sm text-red-400">{errorMessage ?? 'Unable to load activity.'}</p>;
  }

  if (sections.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-navy-600 bg-navy-900/40 p-6 text-center">
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={expandAll}
          className="rounded-lg border border-navy-600 px-2.5 py-1 text-xs text-gray-300 hover:bg-navy-700"
        >
          Expand all
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="rounded-lg border border-navy-600 px-2.5 py-1 text-xs text-gray-300 hover:bg-navy-700"
        >
          Collapse all
        </button>
      </div>

      {sections.map((section) => {
        const isCollapsed = collapsed.has(section.key);
        const headingId = `activity-group-${section.key}`;

        return (
          <section
            key={section.key}
            aria-labelledby={headingId}
            className="overflow-hidden rounded-xl border border-navy-700 bg-navy-900/30"
          >
            <button
              type="button"
              id={headingId}
              aria-expanded={!isCollapsed}
              onClick={() => toggleGroup(section.key)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-navy-800/60"
            >
              <span className="flex items-center gap-2">
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-gray-500" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
                )}
                <span className="text-sm font-semibold text-white">{section.label}</span>
              </span>
              <span className="text-xs text-gray-500">{section.events.length}</span>
            </button>

            {!isCollapsed ? (
              <ul className="space-y-0 border-t border-navy-700/80" role="list">
                {section.events.map((event) => {
                  const content = (
                    <>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-100">{event.title}</p>
                          {event.description ? (
                            <p className="mt-1 text-xs text-gray-500">{event.description}</p>
                          ) : null}
                          {event.activityType ? (
                            <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-600">
                              {event.activityType.replace(/_/g, ' ')}
                            </p>
                          ) : null}
                        </div>
                        <time
                          dateTime={event.createdAt}
                          className="shrink-0 text-xs text-gray-500"
                        >
                          {formatActivityEventTime(event.createdAt)}
                        </time>
                      </div>
                    </>
                  );

                  return (
                    <li
                      key={event.id}
                      className="border-b border-navy-700/50 px-4 py-3 last:border-b-0"
                    >
                      {onEventClick ? (
                        <button
                          type="button"
                          onClick={() => onEventClick(event)}
                          className="w-full text-left transition-colors hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
                          aria-label={`View activity event ${event.title}`}
                        >
                          {content}
                        </button>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </section>
        );
      })}

      <div ref={sentinelRef} className="h-2" aria-hidden="true" />
      {isFetchingNextPage ? (
        <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading more…
        </div>
      ) : null}
    </div>
  );
});

export default GroupedEventTimeline;
