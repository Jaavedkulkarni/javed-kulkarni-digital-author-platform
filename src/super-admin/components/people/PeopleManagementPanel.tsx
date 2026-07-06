import type { PeopleRecord } from '../../types/people.types';

export function PeopleManagementPanel({ people, isLoading, onSuspend }: { people?: PeopleRecord[]; isLoading?: boolean; onSuspend?: (id: string) => void }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading people...</p>;
  return (
    <div className="space-y-2">
      {(people ?? []).map((p) => (
        <div key={p.id} className="flex justify-between items-center rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-3">
          <div>
            <p className="text-sm text-white">{p.name}</p>
            <p className="text-xs text-gray-500">{p.email} · {p.type} · {p.status}</p>
          </div>
          {p.status === 'active' && onSuspend && (
            <button type="button" onClick={() => onSuspend(p.id)} className="text-xs text-red-400">Suspend</button>
          )}
        </div>
      ))}
    </div>
  );
}
