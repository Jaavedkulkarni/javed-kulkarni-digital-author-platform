import type { AuthorServiceRequest } from '../../types/authorServices.types';

export function AuthorServicesPanel({
  queue,
  isLoading,
  onAssign,
}: {
  queue?: AuthorServiceRequest[];
  isLoading?: boolean;
  onAssign?: (id: string) => void;
}) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading author services...</p>;

  return (
    <div className="space-y-2">
      {(queue ?? []).map((r) => (
        <div key={r.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4 flex justify-between">
          <div>
            <p className="text-sm text-white">{r.requestNumber} — {r.type.replace('_', ' ')}</p>
            <p className="text-xs text-gray-500">{r.authorName} · {r.status}</p>
          </div>
          {r.status === 'queued' && onAssign && (
            <button type="button" onClick={() => onAssign(r.id)} className="text-xs text-gold-400">Assign</button>
          )}
        </div>
      ))}
    </div>
  );
}
