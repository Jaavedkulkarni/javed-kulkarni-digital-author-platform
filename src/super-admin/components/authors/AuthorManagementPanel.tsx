import type { AuthorManagementRecord } from '../../types/author.types';

export function AuthorManagementPanel({
  authors,
  isLoading,
  onSetPremium,
  onSuspend,
}: {
  authors?: AuthorManagementRecord[];
  isLoading?: boolean;
  onSetPremium?: (id: string) => void;
  onSuspend?: (id: string) => void;
}) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading authors...</p>;
  return (
    <div className="space-y-2">
      {(authors ?? []).map((a) => (
        <div key={a.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4 flex justify-between">
          <div>
            <p className="text-sm text-white">{a.displayName}</p>
            <p className="text-xs text-gray-500">{a.verificationStatus} · Trust {a.trustScore} · ₹{a.totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="flex gap-2">
            {a.verificationStatus !== 'premium' && onSetPremium && (
              <button type="button" onClick={() => onSetPremium(a.id)} className="text-xs text-gold-400">Premium</button>
            )}
            {a.status === 'active' && onSuspend && (
              <button type="button" onClick={() => onSuspend(a.id)} className="text-xs text-red-400">Suspend</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
