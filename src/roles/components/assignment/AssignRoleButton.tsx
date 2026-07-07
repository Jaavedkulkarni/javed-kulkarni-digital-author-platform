import { memo, useState } from 'react';
import type { SystemRole } from '../../../types/roles';
import { PrimaryButton } from '../../../components/shared/buttons/PrimaryButton';

interface AssignRoleButtonProps {
  role: SystemRole;
  disabled?: boolean;
  loading?: boolean;
  onAssign: (role: SystemRole) => Promise<{ success: boolean; errors?: string[]; message?: string }>;
  onSuccess?: (message?: string) => void;
  onError?: (errors: string[]) => void;
  className?: string;
}

export const AssignRoleButton = memo(function AssignRoleButton({
  role,
  disabled = false,
  loading = false,
  onAssign,
  onSuccess,
  onError,
  className,
}: AssignRoleButtonProps) {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    try {
      const result = await onAssign(role);
      if (result.success) onSuccess?.(result.message);
      else onError?.(result.errors ?? ['Unexpected server error.']);
    } finally {
      setPending(false);
    }
  };

  return (
    <PrimaryButton
      type="button"
      className={className}
      disabled={disabled || loading || pending}
      onClick={handleClick}
    >
      {pending || loading ? 'Assigning…' : 'Assign'}
    </PrimaryButton>
  );
});

export default AssignRoleButton;
