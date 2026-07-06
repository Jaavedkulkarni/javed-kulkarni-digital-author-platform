import type { PlatformAdminRecord } from '../../types/platformAdmin.types';

export function PlatformAdminManagementPanel({
  admins,
  isLoading,
  onDeactivate,
}: {
  admins?: PlatformAdminRecord[];
  isLoading?: boolean;
  onDeactivate?: (id: string) => void;
}) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading platform admins...</p>;
  return (
    <div className="space-y-2">
      {(admins ?? []).map((a) => (
        <div key={a.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4 flex justify-between">
          <div>
            <p className="text-sm text-white">{a.name}</p>
            <p className="text-xs text-gray-500">{a.email} · {a.departments.join(', ')} · {a.status}</p>
          </div>
          {a.status === 'active' && onDeactivate && (
            <button type="button" onClick={() => onDeactivate(a.id)} className="text-xs text-red-400">Deactivate</button>
          )}
        </div>
      ))}
    </div>
  );
}
