import { memo, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { TimelineDetailPayload } from '../../../enterprise/timeline';
import { formatActivityEventTime } from '../../../enterprise/activity/activity-grouping';
import { RiskBadge } from './RiskBadge';

interface EventDetailDrawerProps {
  payload: TimelineDetailPayload | null;
  open: boolean;
  onClose: () => void;
}

const DRAWER_TRANSITION_MS = 300;

function MetaRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 border-b border-navy-700/80 py-2 last:border-0">
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="max-w-[60%] break-all text-right text-xs text-gray-200">{value}</dd>
    </div>
  );
}

export const EventDetailDrawer = memo(function EventDetailDrawer({ payload, open, onClose }: EventDetailDrawerProps) {
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

  if (!payload) return null;

  return (
    <div className={`fixed inset-0 z-[140] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close event detail backdrop"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Event detail: ${payload.title}`}
        className={`absolute right-0 top-0 flex h-full w-full max-w-lg flex-col border-l border-navy-700 bg-[#0f1117] shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionDuration: `${DRAWER_TRANSITION_MS}ms` }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-navy-700 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">{payload.kind} event</p>
            <h2 className="mt-1 text-lg font-semibold text-white">{payload.title}</h2>
            {payload.description ? <p className="mt-1 text-sm text-gray-400">{payload.description}</p> : null}
            <div className="mt-2">
              <RiskBadge severity={payload.severity} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close event detail drawer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-navy-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <section aria-labelledby="event-context">
            <h3 id="event-context" className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Details
            </h3>
            <dl className="rounded-xl border border-navy-700 bg-navy-900/40 p-3">
              <MetaRow label="Actor" value={payload.actorLabel ?? payload.actorId} />
              <MetaRow label="Target" value={payload.targetLabel ?? payload.targetId} />
              <MetaRow label="Timestamp" value={formatActivityEventTime(payload.createdAt)} />
              <MetaRow label="Request ID" value={payload.requestId} />
              <MetaRow label="Trace ID" value={payload.traceId} />
              <MetaRow label="Correlation ID" value={payload.correlationId} />
            </dl>
          </section>

          {payload.relatedEvents && payload.relatedEvents.length > 0 ? (
            <section aria-labelledby="event-related">
              <h3 id="event-related" className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Related events
              </h3>
              <ul className="space-y-2" role="list">
                {payload.relatedEvents.map((related) => (
                  <li key={related.id} className="rounded-lg border border-navy-700 bg-navy-900/40 px-3 py-2">
                    <p className="text-sm text-gray-200">{related.title}</p>
                    <p className="text-xs text-gray-500">{formatActivityEventTime(related.createdAt)}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="event-metadata">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 id="event-metadata" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Metadata
              </h3>
              <button
                type="button"
                onClick={() => setDeveloperMode((prev) => !prev)}
                className="rounded-lg border border-navy-600 px-2 py-1 text-[10px] uppercase tracking-wide text-gray-400 hover:bg-navy-700"
                aria-pressed={developerMode}
              >
                Developer payload
              </button>
            </div>
            <pre className="max-h-64 overflow-auto rounded-lg border border-navy-700 bg-navy-950 p-3 text-xs text-gray-300">
              {JSON.stringify(developerMode ? payload.metadata : payload.metadata, null, 2)}
            </pre>
          </section>
        </div>
      </aside>
    </div>
  );
});

export default EventDetailDrawer;
