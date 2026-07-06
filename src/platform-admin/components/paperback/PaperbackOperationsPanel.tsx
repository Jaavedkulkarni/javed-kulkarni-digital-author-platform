import type { PaperbackRequest, ProductionTracking } from '../../types/paperback.types';

export function PaperbackOperationsPanel({
  requests,
  production,
  isLoading,
  onCreateRfq,
  onAssign,
}: {
  requests?: PaperbackRequest[];
  production?: ProductionTracking[];
  isLoading?: boolean;
  onCreateRfq?: (id: string) => void;
  onAssign?: (id: string) => void;
}) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading paperback operations...</p>;

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-medium text-white mb-3">Paperback Requests</h3>
        <div className="space-y-2">
          {(requests ?? []).map((r) => (
            <div key={r.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-white">{r.requestNumber} — {r.bookTitle}</p>
                <p className="text-xs text-gray-500">Qty {r.quantity} · {r.status}</p>
              </div>
              <div className="flex gap-2">
                {r.status === 'pending' && onCreateRfq && (
                  <button type="button" onClick={() => onCreateRfq(r.id)} className="text-xs px-3 py-1 rounded bg-gold-500/20 text-gold-400">Create RFQ</button>
                )}
                {r.status === 'quoted' && onAssign && (
                  <button type="button" onClick={() => onAssign(r.id)} className="text-xs px-3 py-1 rounded bg-gold-500/20 text-gold-400">Assign Publisher</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-medium text-white mb-3">Production Tracking</h3>
        <div className="space-y-2">
          {(production ?? []).map((p) => (
            <div key={p.id} className="text-sm border border-navy-700 rounded-lg px-3 py-2 bg-navy-800/30">
              <p className="text-white">{p.jobNumber} — {p.bookTitle}</p>
              <p className="text-xs text-gray-500">{p.publisherName} · {p.status} · Proof: {p.proofStatus} · Dispatch: {p.dispatchStatus}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
