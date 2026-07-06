import type { PendingTask, RecentActivity, DepartmentPerformance } from '../../types/dashboard.types';

export function PendingTasksPanel({ tasks, isLoading }: { tasks?: PendingTask[]; isLoading?: boolean }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading tasks...</p>;
  if (!tasks?.length) return <p className="text-sm text-gray-500">No pending tasks.</p>;
  return (
    <ul className="space-y-2" aria-label="Pending tasks">
      {tasks.map((t) => (
        <li key={t.id} className="flex justify-between text-sm border border-navy-700 rounded-lg px-3 py-2 bg-navy-800/30">
          <span className="text-white">{t.title}</span>
          <span className="text-gray-500 capitalize">{t.department}</span>
        </li>
      ))}
    </ul>
  );
}

export function RecentActivityPanel({ activity, isLoading }: { activity?: RecentActivity[]; isLoading?: boolean }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading activity...</p>;
  return (
    <ul className="space-y-2" aria-label="Recent activity">
      {(activity ?? []).map((a) => (
        <li key={a.id} className="text-xs text-gray-400">
          <span className="text-gray-300">{a.message}</span>
          <span className="text-gray-600 ml-2">· {a.department}</span>
        </li>
      ))}
    </ul>
  );
}

export function DepartmentPerformancePanel({ performance, isLoading }: { performance?: DepartmentPerformance[]; isLoading?: boolean }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading performance...</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {(performance ?? []).map((p) => (
        <div key={p.department} className="rounded-lg border border-navy-700 bg-navy-800/30 p-3">
          <p className="text-xs text-gold-400 capitalize">{p.department.replace('_', ' ')}</p>
          <p className="text-sm text-white mt-1">Done today: {p.completedToday}</p>
          <p className="text-xs text-gray-500">Pending: {p.pending} · Avg {p.avgResolutionHours}h</p>
        </div>
      ))}
    </div>
  );
}
