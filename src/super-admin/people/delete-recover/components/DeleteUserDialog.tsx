import { memo } from 'react';
import { PrimaryButton } from '../../../../components/shared/buttons/PrimaryButton';
import { Modal } from '../../../../components/ui/Modal';
import type { PeopleUser } from '../../types/people.types';
import {
  DELETE_DIALOG_MESSAGE,
  DELETE_REASON_OPTIONS,
  DELETE_USER_ERROR_CLASS,
  DELETE_USER_INPUT_CLASS,
  DELETE_USER_LABEL_CLASS,
} from '../delete-recover.constants';
import type { DeleteUserFormInput } from '../delete-recover.types';
import type { BulkUserActionResult } from '../delete-recover.types';

interface DeleteUserDialogProps {
  open: boolean;
  users: PeopleUser[];
  isSubmitting: boolean;
  bulkResults: BulkUserActionResult[];
  bulkProgress: { completed: number; total: number };
  values: DeleteUserFormInput;
  errors: Partial<Record<keyof DeleteUserFormInput, string>>;
  onChange: <K extends keyof DeleteUserFormInput>(key: K, value: DeleteUserFormInput[K]) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteUserDialog = memo(function DeleteUserDialog({
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
}: DeleteUserDialogProps) {
  if (!open) return null;

  const isBulk = users.length > 1;
  const title = isBulk ? `Delete ${users.length} Users` : 'Delete User';

  return (
    <Modal title={title} onClose={isSubmitting ? () => undefined : onClose} maxWidth="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">{DELETE_DIALOG_MESSAGE}</p>

        {!isBulk && users[0] ? (
          <div className="rounded-lg border border-navy-700 bg-navy-900/40 px-4 py-3 space-y-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
              <p className="text-sm font-medium text-white">{users[0].name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
              <p className="text-sm text-gray-300">{users[0].email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Role</p>
              <p className="text-sm text-gray-300">{users[0].primaryRole}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-300">
            You are about to soft-delete{' '}
            <span className="font-medium text-white">{users.length}</span> selected users.
          </p>
        )}

        <div>
          <label htmlFor="delete-reason" className={DELETE_USER_LABEL_CLASS}>
            Reason <span className="text-red-400">*</span>
          </label>
          <select
            id="delete-reason"
            disabled={isSubmitting}
            value={values.reason}
            onChange={(event) =>
              onChange('reason', event.target.value as DeleteUserFormInput['reason'])
            }
            className={DELETE_USER_INPUT_CLASS}
          >
            {DELETE_REASON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.reason ? <p className={DELETE_USER_ERROR_CLASS}>{errors.reason}</p> : null}
        </div>

        <div>
          <label htmlFor="delete-notes" className={DELETE_USER_LABEL_CLASS}>
            Notes (Optional)
          </label>
          <textarea
            id="delete-notes"
            rows={3}
            disabled={isSubmitting}
            value={values.notes ?? ''}
            onChange={(event) => onChange('notes', event.target.value)}
            className={`${DELETE_USER_INPUT_CLASS} min-h-[5rem] resize-y`}
            placeholder="Additional context for administrators…"
          />
          {errors.notes ? <p className={DELETE_USER_ERROR_CLASS}>{errors.notes}</p> : null}
        </div>

        <label className="inline-flex items-start gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            disabled={isSubmitting}
            checked={values.confirmed}
            onChange={(event) => onChange('confirmed', event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-navy-600 bg-navy-900 text-gold-500 focus:ring-gold-400/50"
          />
          <span>I understand this is a recoverable soft delete and the user will lose access immediately.</span>
        </label>
        {errors.confirmed ? <p className={DELETE_USER_ERROR_CLASS}>{errors.confirmed}</p> : null}

        {isSubmitting && isBulk ? (
          <div className="rounded-lg border border-navy-700 bg-navy-900/40 px-4 py-3">
            <p className="text-sm text-gray-300">
              Processing {bulkProgress.completed} of {bulkProgress.total}…
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-700">
              <div
                className="h-full bg-red-500 transition-all duration-300"
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
            disabled={isSubmitting || !values.confirmed}
            onClick={onConfirm}
            className="gap-2 px-5 bg-red-600 hover:bg-red-500"
          >
            {isSubmitting ? 'Deleting…' : isBulk ? 'Delete Selected' : 'Delete User'}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
});

export default DeleteUserDialog;
