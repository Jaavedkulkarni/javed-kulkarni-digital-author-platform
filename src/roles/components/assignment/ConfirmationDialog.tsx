import { memo, type ReactNode } from 'react';
import { Modal } from '../../components/ui/Modal';
import { PrimaryButton, SecondaryButton } from '../../components/shared/buttons/PrimaryButton';
import { DangerButton } from '../../components/shared/buttons/DangerButton';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = memo(function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!open) return null;

  const ConfirmButton = tone === 'danger' ? DangerButton : PrimaryButton;

  return (
    <Modal title={title} onClose={loading ? () => {} : onCancel} maxWidth="sm">
      <div className="space-y-4">
        <div className="text-sm text-gray-300">{description}</div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton type="button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </SecondaryButton>
          <ConfirmButton type="button" onClick={onConfirm} disabled={loading}>
            {loading ? 'Please wait…' : confirmLabel}
          </ConfirmButton>
        </div>
      </div>
    </Modal>
  );
});

export default ConfirmationDialog;
