import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { AuditTimelineItem } from '../../../enterprise/timeline';
import { buildJsonDiff } from '../../../enterprise/timeline';
import { formatActivityEventTime } from '../../../enterprise/activity/activity-grouping';
import { JsonDiffView } from './JsonDiffView';
import { RiskBadge } from './RiskBadge';

interface AuditDetailDrawerProps {
  item: AuditTimelineItem | null;
  open: boolean;
  onClose: () => void;
}

const DRAWER_TRANSITION_MS = 300;

function MetaRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 border-b border-navy-700/80 py-2 last:border-0">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="max-w-[60%] break-all text-right font-mono text-xs text-gray-200">{value}</dd>
    </div>
  );
}

export const AuditDetailDrawer = memo(function AuditDetailDrawer({ item, open, onClose }: AuditDetailDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [developerMode, setDeveloperMode] = useState(false);

  useEffect(() => {
    if (!open) setDeveloperMode(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  const diffEntries = useMemo(
    () => buildJsonDiff(item?.beforeState, item?.afterState, true),
    [item?.afterState, item?.beforeState],
  );

  if (!item) return null;

  const metadata = item.metadata ?? {};

  return (
    <div className={`fixed inset-0 z-[140] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close audit detail backdrop"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Audit detail: ${item.action}`}
        className={`absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-navy-700 bg-[#0f1117] shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionDuration: `${DRAWER_TRANSITION_MS}ms` }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-navy-700 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Audit entry</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{item.action}</h2>
            <p className="mt-1 text-sm text-gray-400">{item.entity}</p>
            <div className="mt-2">
              <RiskBadge severity={item.severity} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close audit detail drawer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-navy-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <section aria-labelledby="audit-actors">
            <h3 id="audit-actors" className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Context
            </h3>
            <dl className="rounded-xl border border-navy-700 bg-navy-900/40 p-3">
              <MetaRow label="Actor" value={item.actorLabel ?? item.actorId} />
              <MetaRow label="Target" value={item.targetLabel ?? item.targetId} />
              <MetaRow label="Timestamp" value={formatActivityEventTime(item.createdAt)} />
              <MetaRow label="Browser" value={item.browser} />
              <MetaRow label="Operating System" value={item.operatingSystem} />
              <MetaRow label="Platform" value={item.platform} />
              <MetaRow label="IP Address" value={item.ipAddress} />
              <MetaRow label="Request ID" value={item.requestId} />
              <MetaRow label="Trace ID" value={item.traceId} />
              <MetaRow label="Correlation ID" value={item.correlationId} />
            </dl>
          </section>

          <section aria-labelledby="audit-diff">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 id="audit-diff" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Changes
              </h3>
              <button
                type="button"
                onClick={() => setDeveloperMode((prev) => !prev)}
                className="rounded-lg border border-navy-600 px-2 py-1 text-[10px] uppercase tracking-wide text-gray-400 hover:bg-navy-700"
                aria-pressed={developerMode}
              >
                Developer mode
              </button>
            </div>
            {developerMode ? (
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-xs text-gray-500">Raw JSON</p>
                  <pre className="max-h-48 overflow-auto rounded-lg border border-navy-700 bg-navy-950 p-3 text-xs text-gray-300">
                    {JSON.stringify({ before: item.beforeState, after: item.afterState }, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-500">Metadata</p>
                  <pre className="max-h-48 overflow-auto rounded-lg border border-navy-700 bg-navy-950 p-3 text-xs text-gray-300">
                    {JSON.stringify(metadata, null, 2)}
                  </pre>
                </div>
                <dl className="rounded-xl border border-navy-700 bg-navy-900/40 p-3">
                  <MetaRow label="Headers" value={typeof metadata.headers === 'string' ? metadata.headers : metadata.headers ? JSON.stringify(metadata.headers) : null} />
                  <MetaRow label="Latency" value={metadata.latencyMs != null ? `${metadata.latencyMs}ms` : null} />
                  <MetaRow label="Edge Function" value={typeof metadata.edgeFunction === 'string' ? metadata.edgeFunction : null} />
                  <MetaRow label="Background Job" value={typeof metadata.backgroundJob === 'string' ? metadata.backgroundJob : null} />
                </dl>
              </div>
            ) : (
              <JsonDiffView entries={diffEntries} />
            )}
          </section>
        </div>
      </aside>
    </div>
  );
});

export default AuditDetailDrawer;
