import type { PublisherApprovalRecord } from '../../types/publisher.types';

export function PublisherManagementPanel({
  publishers,
  isLoading,
  onApprove,
  onReject,
}: {
  publishers?: PublisherApprovalRecord[];
  isLoading?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading publishers...</p>;
  return (
    <div className="space-y-3">
      {(publishers ?? []).map((p) => (
        <div key={p.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-white">{p.companyName}</p>
              <p className="text-xs text-gray-500">{p.contactEmail} · {p.status} · {p.completedJobs} jobs</p>
              <p className="text-xs text-gray-600">Docs: {p.documentsVerified ? '✓' : '—'} · Agreement: {p.agreementSigned ? '✓' : '—'}</p>
            </div>
            {(p.status === 'pending' || p.status === 'review') && (
              <div className="flex gap-2">
                {onApprove && <button type="button" onClick={() => onApprove(p.id)} className="text-xs px-2 py-1 rounded bg-green-600/20 text-green-400">Approve</button>}
                {onReject && <button type="button" onClick={() => onReject(p.id)} className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-400">Reject</button>}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
