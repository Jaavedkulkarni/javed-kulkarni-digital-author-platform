import type { SecurityAuditEntry, ActiveSession } from '../../types/security.types';

export function SecurityAuditPanel({ auditLog, sessions, isLoading }: { auditLog?: SecurityAuditEntry[]; sessions?: ActiveSession[]; isLoading?: boolean }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading security...</p>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Audit Center</h3>
        <ul className="space-y-1 text-xs text-gray-400">
          {(auditLog ?? []).map((a) => (
            <li key={a.id}>{a.description} · {a.eventType}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Active Sessions</h3>
        <ul className="space-y-1 text-xs text-gray-400">
          {(sessions ?? []).map((s) => (
            <li key={s.id}>{s.device} · {s.location}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
