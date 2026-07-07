import { memo } from 'react';
import { PrimaryButton } from '../../../../components/shared/buttons/PrimaryButton';
import { Modal } from '../../../../components/ui/Modal';
import type { PeopleUser } from '../../types/people.types';
import {
  SUSPEND_DIALOG_MESSAGE,
  SUSPEND_REASON_OPTIONS,
  SUSPEND_USER_ERROR_CLASS,
  SUSPEND_USER_INPUT_CLASS,
  SUSPEND_USER_LABEL_CLASS,
} from '../suspend-restore.constants';
import type { SuspendUserFormValues } from '../suspend-restore.schema';
import type { BulkUserActionResult } from '../suspend-restore.types';

interface SuspendUserDialogProps {
  open: boolean;
  users: PeopleUser[];
  isSubmitting: boolean;
  bulkResults: BulkUserActionResult[];
  bulkProgress: { completed: number; total: number };
  values: SuspendUserFormValues;
  errors: Partial<Record<keyof SuspendUserFormValues, string>>;
  onChange: <K extends keyof SuspendUserFormValues>(key: K, value: SuspendUserFormValues[K]) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const SuspendUserDialog = memo(function SuspendUserDialog({
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
}: SuspendUserDialogProps) {
  if (!open) return null;

  const isBulk = users.length > 1;
  const title = isBulk ? `Suspend ${users.length} Users` : 'Suspend User';

  return (
    <Modal title={title} onClose={isSubmitting ? () => undefined : onClose} maxWidth="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">{SUSPEND_DIALOG_MESSAGE}</p>

        {!isBulk && users[0] ? (
          <div className="rounded-lg border border-navy-700 bg-navy-900/40 px-4 py-3">
            <p className="text-sm font-medium text-white">{users[0].name}</p>
            <p className="text-xs text-gray-400">{users[0].email}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-300">
            You are about to suspend <span className="font-medium text-white">{users.length}</span>{' '}
            selected users.
          </p>
        )}

        <div>
          <label htmlFor="suspend-reason" className={SUSPEND_USER_LABEL_CLASS}>
            Reason <span className="text-red-400">*</span>
          </label>
          <select
            id="suspend-reason"
            disabled={isSubmitting}
            value={values.reason}
            onChange={(event) => onChange('reason', event.target.value as SuspendUserFormValues['reason'])}
            className={SUSPEND_USER_INPUT_CLASS}
          >
            {SUSPEND_REASON_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.reason ? <p className={SUSPEND_USER_ERROR_CLASS}>{errors.reason}</p> : null}
        </div>

        <div>
          <label htmlFor="suspend-notes" className={SUSPEND_USER_LABEL_CLASS}>
            Notes (Optional)
          </label>
          <textarea
            id="suspend-notes"
            rows={3}
            disabled={isSubmitting}
            value={values.notes ?? ''}
            onChange={(event) => onChange('notes', event.target.value)}
            className={`${SUSPEND_USER_INPUT_CLASS} min-h-[5rem] resize-y`}
            placeholder="Additional context for administrators…"
          />
          {errors.notes ? <p className={SUSPEND_USER_ERROR_CLASS}>{errors.notes}</p> : null}
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            disabled={isSubmitting}
            checked={values.effectiveImmediately}
            onChange={(event) => onChange('effectiveImmediately', event.target.checked)}
            className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-gold-500 focus:ring-gold-400/50"
          />
          Effective Immediately
        </label>

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
            {isSubmitting ? 'Suspending…' : isBulk ? 'Suspend Selected' : 'Suspend User'}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
});

export default SuspendUserDialog;
