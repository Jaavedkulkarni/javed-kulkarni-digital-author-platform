import { memo, useCallback, type ReactNode } from 'react';
import { Download, Loader2, Search } from 'lucide-react';
import type { TimelineExportFormat, TimelineFilters, TimelineMetrics } from '../../../enterprise/timeline';
import {
  TIMELINE_EXPORT_FORMATS,
  TIMELINE_INPUT_CLASS,
  TIMELINE_LABEL_CLASS,
  TIMELINE_SEVERITY_OPTIONS,
} from '../../../super-admin/people/timeline/timeline.constants';
import { TimelineMetricsBar } from './TimelineMetricsBar';

interface TimelinePanelShellProps {
  title: string;
  filters: TimelineFilters;
  onFiltersChange: (filters: TimelineFilters) => void;
  onExport: (format: TimelineExportFormat) => void;
  isExporting?: boolean;
  metrics?: TimelineMetrics | null;
  renderTimeMs?: number;
  eventTypeOptions?: ReadonlyArray<{ value: string; label: string }>;
  actionOptions?: ReadonlyArray<{ value: string; label: string }>;
  children: ReactNode;
}

export const TimelinePanelShell = memo(function TimelinePanelShell({
  title,
  filters,
  onFiltersChange,
  onExport,
  isExporting = false,
  metrics = null,
  renderTimeMs,
  eventTypeOptions,
  actionOptions,
  children,
}: TimelinePanelShellProps) {
  const updateFilter = useCallback(
    (patch: Partial<TimelineFilters>) => onFiltersChange({ ...filters, ...patch }),
    [filters, onFiltersChange],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">Read-only timeline with server-side pagination.</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor={`${title}-export-format`} className="sr-only">
            Export format
          </label>
          <select
            id={`${title}-export-format`}
            defaultValue="csv"
            className="min-h-9 rounded-lg border border-navy-600 bg-navy-900/60 px-2 text-xs text-gray-200"
            aria-label="Export format"
          >
            {TIMELINE_EXPORT_FORMATS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => {
              const select = document.getElementById(`${title}-export-format`) as HTMLSelectElement | null;
              onExport((select?.value ?? 'csv') as TimelineExportFormat);
            }}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-navy-600 px-3 text-xs text-gray-200 hover:bg-navy-700 disabled:opacity-50"
            aria-label={`Export ${title}`}
          >
            {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label htmlFor={`${title}-search`} className={TIMELINE_LABEL_CLASS}>
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              id={`${title}-search`}
              type="search"
              value={filters.search ?? ''}
              onChange={(event) => updateFilter({ search: event.target.value })}
              placeholder="Search events…"
              className={`${TIMELINE_INPUT_CLASS} pl-9`}
              aria-label={`Search ${title}`}
            />
          </div>
        </div>
        <div>
          <label htmlFor={`${title}-severity`} className={TIMELINE_LABEL_CLASS}>
            Severity
          </label>
          <select
            id={`${title}-severity`}
            value={filters.severity ?? ''}
            onChange={(event) => updateFilter({ severity: event.target.value as TimelineFilters['severity'] })}
            className={TIMELINE_INPUT_CLASS}
          >
            {TIMELINE_SEVERITY_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {eventTypeOptions ? (
          <div>
            <label htmlFor={`${title}-event-type`} className={TIMELINE_LABEL_CLASS}>
              Event type
            </label>
            <select
              id={`${title}-event-type`}
              value={filters.eventType ?? ''}
              onChange={(event) => updateFilter({ eventType: event.target.value })}
              className={TIMELINE_INPUT_CLASS}
            >
              {eventTypeOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {actionOptions ? (
          <div>
            <label htmlFor={`${title}-action`} className={TIMELINE_LABEL_CLASS}>
              Action
            </label>
            <select
              id={`${title}-action`}
              value={filters.action ?? ''}
              onChange={(event) => updateFilter({ action: event.target.value })}
              className={TIMELINE_INPUT_CLASS}
            >
              {actionOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div>
          <label htmlFor={`${title}-date-from`} className={TIMELINE_LABEL_CLASS}>
            From
          </label>
          <input
            id={`${title}-date-from`}
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(event) => updateFilter({ dateFrom: event.target.value })}
            className={TIMELINE_INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor={`${title}-date-to`} className={TIMELINE_LABEL_CLASS}>
            To
          </label>
          <input
            id={`${title}-date-to`}
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(event) => updateFilter({ dateTo: event.target.value })}
            className={TIMELINE_INPUT_CLASS}
          />
        </div>
      </div>

      <TimelineMetricsBar metrics={metrics} renderTimeMs={renderTimeMs} />

      {children}
    </div>
  );
});

export default TimelinePanelShell;
