import { memo } from 'react';
import { PrimaryButton } from '../../../../components/shared/buttons/PrimaryButton';
import { Modal } from '../../../../components/ui/Modal';
import type { PeopleUser } from '../../types/people.types';
import {
  RESTORE_DIALOG_MESSAGE,
  SUSPEND_USER_ERROR_CLASS,
  SUSPEND_USER_INPUT_CLASS,
  SUSPEND_USER_LABEL_CLASS,
} from '../suspend-restore.constants';
import type { RestoreUserFormValues } from '../suspend-restore.schema';
import type { BulkUserActionResult } from '../suspend-restore.types';

interface RestoreUserDialogProps {
  open: boolean;
  users: PeopleUser[];
  isSubmitting: boolean;
  bulkResults: BulkUserActionResult[];
  bulkProgress: { completed: number; total: number };
  values: RestoreUserFormValues;
  errors: Partial<Record<keyof RestoreUserFormValues, string>>;
  onChange: <K extends keyof RestoreUserFormValues>(key: K, value: RestoreUserFormValues[K]) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const RestoreUserDialog = memo(function RestoreUserDialog({
  open,
  users,
  isSubmitting,
  bulkResults,
  bulkProgress,
  values,
  errors,
  onChange,
  onClose,
  onConfirm,
}: RestoreUserDialogProps) {
  if (!open) return null;

  const isBulk = users.length > 1;
  const title = isBulk ? `Restore ${users.length} Users` : 'Restore User';

  return (
    <Modal title={title} onClose={isSubmitting ? () => undefined : onClose} maxWidth="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">{RESTORE_DIALOG_MESSAGE}</p>

        {!isBulk && users[0] ? (
          <div className="rounded-lg border border-navy-700 bg-navy-900/40 px-4 py-3">
            <p className="text-sm font-medium text-white">{users[0].name}</p>
            <p className="text-xs text-gray-400">{users[0].email}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-300">
            You are about to restore <span className="font-medium text-white">{users.length}</span>{' '}
            selected users.
          </p>
        )}

        <div>
          <label htmlFor="restore-notes" className={SUSPEND_USER_LABEL_CLASS}>
            Notes (Optional)
          </label>
          <textarea
            id="restore-notes"
            rows={3}
            disabled={isSubmitting}
            value={values.notes ?? ''}
            onChange={(event) => onChange('notes', event.target.value)}
            className={`${SUSPEND_USER_INPUT_CLASS} min-h-[5rem] resize-y`}
            placeholder="Optional notes about this restoration…"
          />
          {errors.notes ? <p className={SUSPEND_USER_ERROR_CLASS}>{errors.notes}</p> : null}
        </div>

        {isSubmitting && isBulk ? (
          <div className="rounded-lg border border-navy-700 bg-navy-900/40 px-4 py-3">
            <p className="text-sm text-gray-300">
              Processing {bulkProgress.completed} of {bulkProgress.total}…
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-700">
              <div
                className="h-full bg-gold-500 transition-all duration-300"
                style={{
                  width: `${bulkProgress.total === 0 ? 0 : (bulkProgress.completed / bulkProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        ) : null}

        {bulkResults.length > 0 ? (
          <ul className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-navy-700 bg-navy-900/40 p-3">
            {bulkResults.map((result) => (
              <li key={result.user.id} className="text-xs">
                <span className={result.success ? 'text-emerald-400' : 'text-red-400'}>
                  {result.success ? '✓' : '✕'} {result.user.name}
                </span>
                {!result.success && result.message ? (
                  <span className="ml-2 text-gray-500">{result.message}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="inline-flex min-h-10 items-center rounded-lg border border-navy-600 bg-navy-900/60 px-5 text-sm font-medium text-gray-200 transition-colors hover:bg-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <PrimaryButton
            placeholder
            interactive
            disabled={isSubmitting}
            onClick={onConfirm}
            className="gap-2 px-5"
          >
            {isSubmitting ? 'Restoring…' : isBulk ? 'Restore Selected' : 'Restore User'}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
});

export default RestoreUserDialog;
