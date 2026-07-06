import type { SupportTicket } from '../../types/support.types';

export function SupportPanel({
  tickets,
  isLoading,
  onAssign,
}: {
  tickets?: SupportTicket[];
  isLoading?: boolean;
  onAssign?: (id: string) => void;
}) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading tickets...</p>;

  return (
    <div className="space-y-2" aria-label="Support tickets">
      {(tickets ?? []).map((t) => (
        <div key={t.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <div className="flex justify-between">
            <p className="text-sm text-white">{t.ticketNumber} — {t.subject}</p>
            <span className="text-xs text-gray-500 capitalize">{t.priority}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{t.category} · {t.status}{t.assignee ? ` · ${t.assignee}` : ''}</p>
          {!t.assignee && onAssign && (
            <button type="button" onClick={() => onAssign(t.id)} className="mt-2 text-xs text-gold-400">Assign to me</button>
          )}
        </div>
      ))}
    </div>
  );
}
