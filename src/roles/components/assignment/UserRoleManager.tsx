import { memo, useState } from 'react';
import { PrimaryButton } from '../../../components/shared/buttons/PrimaryButton';
import { useRoleAssignment } from '../../hooks/useRoleAssignment';
import { UserRoleList } from '../UserRoleList';
import { RoleBadge } from '../RoleBadge';
import { RoleAssignmentDialog } from './RoleAssignmentDialog';
import { RemoveRoleButton } from './RemoveRoleButton';
import { format } from 'date-fns';

interface UserRoleManagerProps {
  targetUserId: string;
  className?: string;
  onNotice?: (message: string, tone?: 'success' | 'error') => void;
}

export const UserRoleManager = memo(function UserRoleManager({
  targetUserId,
  className,
  onNotice,
}: UserRoleManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    currentRoles,
    availableRoles,
    removableRoles,
    history,
    canManage,
    isLoading,
    isAssigning,
    isRemoving,
    assignUserRole,
    removeUserRole,
  } = useRoleAssignment(targetUserId);

  if (!canManage) {
    return (
      <div className={className}>
        <p className="text-sm text-white/50">You do not have permission to manage roles for this user.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className ?? ''}`}>
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">Current Roles</h3>
          <PrimaryButton
            type="button"
            disabled={isLoading || availableRoles.length === 0}
            onClick={() => setDialogOpen(true)}
          >
            Assign role
          </PrimaryButton>
        </div>
        <UserRoleList roles={currentRoles} loading={isLoading} variant="chip" />
        {removableRoles.length > 0 ? (
          <ul className="space-y-2">
            {removableRoles.map((role) => (
              <li
                key={role}
                className="flex items-center justify-between gap-3 rounded-lg border border-navy-700 bg-navy-900/40 px-3 py-2"
              >
                <RoleBadge role={role} />
                <RemoveRoleButton
                  role={role}
                  loading={isRemoving || isAssigning}
                  onRemove={(selectedRole) => removeUserRole(selectedRole)}
                  onSuccess={(message) => onNotice?.(message ?? 'Role removed successfully.', 'success')}
                  onError={(errors) => onNotice?.(errors[0] ?? 'Unexpected server error.', 'error')}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Available Roles</h3>
        {availableRoles.length === 0 ? (
          <p className="text-sm text-white/50">No additional roles can be assigned.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {availableRoles.map((role) => (
              <li key={role}>
                <RoleBadge role={role} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Assignment History</h3>
        {isLoading ? (
          <p className="text-sm text-white/50">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-white/50">No assignment history yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-navy-700 bg-navy-900/30 px-3 py-2 text-sm text-gray-300"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium capitalize text-white">{entry.action}</span>
                  <RoleBadge role={entry.roleName} />
                  <span className="text-xs text-gray-500">
                    {format(new Date(entry.createdAt), 'dd MMM yyyy, HH:mm')}
                  </span>
                </div>
                {entry.reason ? <p className="mt-1 text-xs text-gray-400">{entry.reason}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <RoleAssignmentDialog
        open={dialogOpen}
        availableRoles={availableRoles}
        loading={isAssigning}
        onClose={() => setDialogOpen(false)}
        onAssign={(role, reason) => assignUserRole(role, reason)}
        onSuccess={(message) => {
          onNotice?.(message ?? 'Role assigned successfully.', 'success');
          setDialogOpen(false);
        }}
        onError={(errors) => onNotice?.(errors[0] ?? 'Unexpected server error.', 'error')}
      />
    </div>
  );
});

export default UserRoleManager;
