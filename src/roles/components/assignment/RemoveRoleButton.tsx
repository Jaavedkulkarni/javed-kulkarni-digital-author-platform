import { memo, useState } from 'react';
import type { SystemRole } from '../../../types/roles';
import { SYSTEM_ROLE_LABELS } from '../../constants/role.constants';
import { DangerButton } from '../../../components/shared/buttons/DangerButton';
import { ConfirmationDialog } from './ConfirmationDialog';

interface RemoveRoleButtonProps {
  role: SystemRole;
  disabled?: boolean;
  loading?: boolean;
  onRemove: (role: SystemRole) => Promise<{ success: boolean; errors?: string[]; message?: string }>;
  onSuccess?: (message?: string) => void;
  onError?: (errors: string[]) => void;
  className?: string;
}

export const RemoveRoleButton = memo(function RemoveRoleButton({
  role,
  disabled = false,
  loading = false,
  onRemove,
  onSuccess,
  onError,
  className,
}: RemoveRoleButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleConfirm = async () => {
    setPending(true);
    try {
      const result = await onRemove(role);
      if (result.success) {
        onSuccess?.(result.message);
        setOpen(false);
      } else {
        onError?.(result.errors ?? ['Unexpected server error.']);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <DangerButton
        type="button"
        className={className}
        disabled={disabled || loading || pending}
        onClick={() => setOpen(true)}
      >
        Remove
      </DangerButton>
      <ConfirmationDialog
        open={open}
        title={`Remove ${SYSTEM_ROLE_LABELS[role]}?`}
        description={`This will remove the ${SYSTEM_ROLE_LABELS[role]} role from this user.`}
        confirmLabel="Remove role"
        tone="danger"
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
});

export default RemoveRoleButton;
