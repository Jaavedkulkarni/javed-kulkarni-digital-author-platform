import { memo, useMemo, useState } from 'react';
import type { SystemRole } from '../../../types/roles';
import { Modal } from '../../../components/ui/Modal';
import { PrimaryButton, SecondaryButton } from '../../../components/shared/buttons/PrimaryButton';
import { SYSTEM_ROLE_LABELS } from '../../constants/role.constants';
import { RoleSelector } from './RoleSelector';

interface RoleAssignmentDialogProps {
  open: boolean;
  availableRoles: SystemRole[];
  loading?: boolean;
  onClose: () => void;
  onAssign: (
    role: SystemRole,
    reason?: string | null
  ) => Promise<{ success: boolean; errors?: string[]; message?: string }>;
  onSuccess?: (message?: string) => void;
  onError?: (errors: string[]) => void;
}

export const RoleAssignmentDialog = memo(function RoleAssignmentDialog({
  open,
  availableRoles,
  loading = false,
  onClose,
  onAssign,
  onSuccess,
  onError,
}: RoleAssignmentDialogProps) {
  const [selectedRole, setSelectedRole] = useState<SystemRole | ''>('');
  const [reason, setReason] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => Boolean(selectedRole) && !pending && !loading, [selectedRole, pending, loading]);

  const handleClose = () => {
    if (pending) return;
    setSelectedRole('');
    setReason('');
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;
    setPending(true);
    setError(null);
    try {
      const result = await onAssign(selectedRole, reason.trim() || null);
      if (result.success) {
        onSuccess?.(result.message);
        setSelectedRole('');
        setReason('');
        onClose();
      } else {
        const message = result.errors?.[0] ?? 'Unexpected server error.';
        setError(message);
        onError?.(result.errors ?? [message]);
      }
    } finally {
      setPending(false);
    }
  };

  if (!open) return null;

  return (
    <Modal title="Assign Role" onClose={handleClose}>
      <div className="space-y-4">
        <RoleSelector
          roles={availableRoles}
          value={selectedRole}
          onChange={setSelectedRole}
          disabled={pending || loading}
        />

        <div className="space-y-1.5">
          <label htmlFor="assignment-reason" className="text-sm font-medium text-gray-200">
            Reason (optional)
          </label>
          <textarea
            id="assignment-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            disabled={pending || loading}
            className="w-full rounded-lg border border-navy-600 bg-navy-900/70 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-400/40"
            placeholder="Optional note for the audit log"
          />
        </div>

        {selectedRole ? (
          <p className="text-xs text-gray-400">
            Assigning <span className="text-white">{SYSTEM_ROLE_LABELS[selectedRole]}</span> to this user.
          </p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton type="button" onClick={handleClose} disabled={pending}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleSubmit} disabled={!canSubmit}>
            {pending ? 'Assigning…' : 'Assign role'}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
});

export default RoleAssignmentDialog;
