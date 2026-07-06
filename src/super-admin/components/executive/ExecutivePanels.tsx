import type { ExecutiveActivity } from '../../types/executive.types';
import type { SystemStatusItem } from '../../types/executive.types';

export function RecentActivitiesPanel({ activities, isLoading }: { activities?: ExecutiveActivity[]; isLoading?: boolean }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading...</p>;
  return (
    <ul className="space-y-2" aria-label="Recent activities">
      {(activities ?? []).map((a) => (
        <li key={a.id} className="text-xs text-gray-400">
          <span className="text-gray-300">{a.message}</span>
          <span className="text-gray-600 ml-2">· {a.category}</span>
        </li>
      ))}
    </ul>
  );
}

export function SystemStatusPanel({ items, isLoading }: { items?: SystemStatusItem[]; isLoading?: boolean }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading...</p>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {(items ?? []).map((s) => (
        <div key={s.id} className="rounded border border-navy-700 bg-navy-800/30 p-3">
          <p className="text-xs text-white">{s.service}</p>
          <p className={`text-xs capitalize mt-1 ${s.status === 'healthy' ? 'text-green-400' : 'text-amber-400'}`}>{s.status}</p>
          <p className="text-xs text-gray-600">{s.latencyMs}ms</p>
        </div>
      ))}
    </div>
  );
}
