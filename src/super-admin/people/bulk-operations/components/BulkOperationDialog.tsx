import { memo, useCallback, useMemo, useState } from 'react';
import { PrimaryButton } from '../../../../components/shared/buttons/PrimaryButton';
import { Modal } from '../../../../components/ui/Modal';
import {
  BULK_DELETE_CONFIRMATION,
  BULK_OPERATION_INPUT_CLASS,
  BULK_OPERATION_LABEL_CLASS,
  DEFAULT_BULK_INVITE_ROLE,
} from '../bulk-operations.constants';
import {
  BULK_OPERATION_LABELS,
  BULK_OPERATIONS_REQUIRING_CONFIRM,
  BULK_OPERATIONS_REQUIRING_ROLE,
  type BulkOperationPayload,
} from '../bulk-operations.types';
import type { UsePeopleBulkOperationsReturn } from '../bulk-operations.hooks';
import { exportBulkResultsToCsv } from '../utils/export-results-csv';
import { SUSPEND_REASON_OPTIONS } from '../../suspend-restore/suspend-restore.constants';

interface BulkOperationDialogProps {
  controller: UsePeopleBulkOperationsReturn;
  roleOptions: Array<{ value: string; label: string }>;
}

export const BulkOperationDialog = memo(function BulkOperationDialog({
  controller,
  roleOptions,
}: BulkOperationDialogProps) {
  const { operation, targets, isRunning, progress, execute, cancel, close } = controller;
  const [reason, setReason] = useState('policy_violation');
  const [notes, setNotes] = useState('');
  const [role, setRole] = useState(DEFAULT_BULK_INVITE_ROLE);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [effectiveImmediately, setEffectiveImmediately] = useState(true);

  const title = operation ? BULK_OPERATION_LABELS[operation] : 'Bulk Operation';
  const showResults = progress.results.length > 0 && !isRunning;
  const requiresRole = operation ? BULK_OPERATIONS_REQUIRING_ROLE.includes(operation) : false;
  const requiresConfirm = operation ? BULK_OPERATIONS_REQUIRING_CONFIRM.includes(operation) : false;
  const isSuspend = operation === 'suspend';
  const isBulkEdit = operation === 'bulk_edit';
  const [bulkEditStatus, setBulkEditStatus] = useState('active');

  const canSubmit = useMemo(() => {
    if (requiresConfirm && deleteConfirm !== BULK_DELETE_CONFIRMATION) return false;
    if (requiresRole && !role.trim()) return false;
    return true;
  }, [deleteConfirm, requiresConfirm, requiresRole, role]);

  const handleConfirm = useCallback(() => {
    if (!operation) return;
    const payload: BulkOperationPayload = {
      notes: notes.trim() || undefined,
      effectiveImmediately,
      role: role.trim() || undefined,
      confirmed: requiresConfirm ? true : undefined,
    };
    if (isSuspend) payload.reason = reason;
    if (operation === 'delete') payload.reason = reason;
    if (isBulkEdit) payload.fields = { status: bulkEditStatus };
    void execute(payload);
  }, [bulkEditStatus, effectiveImmediately, execute, isBulkEdit, isSuspend, notes, operation, reason, requiresConfirm, role]);

  const handleExportResults = useCallback(() => {
    if (!operation) return;
    exportBulkResultsToCsv(progress.results, operation);
  }, [operation, progress.results]);

  if (!operation) return null;

  return (
    <Modal title={title} onClose={isRunning ? () => undefined : close} maxWidth="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Processing <span className="font-medium text-white">{targets.length}</span> selected users.
        </p>

        {isBulkEdit ? (
          <div>
            <label htmlFor="bulk-edit-status" className={BULK_OPERATION_LABEL_CLASS}>
              Status
            </label>
            <select
              id="bulk-edit-status"
              disabled={isRunning}
              value={bulkEditStatus}
              onChange={(event) => setBulkEditStatus(event.target.value)}
              className={BULK_OPERATION_INPUT_CLASS}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        ) : null}

        {isSuspend || operation === 'delete' ? (
          <div>
            <label htmlFor="bulk-reason" className={BULK_OPERATION_LABEL_CLASS}>
              Reason
            </label>
            <select
              id="bulk-reason"
              disabled={isRunning}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className={BULK_OPERATION_INPUT_CLASS}
            >
              {SUSPEND_REASON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {requiresRole ? (
          <div>
            <label htmlFor="bulk-role" className={BULK_OPERATION_LABEL_CLASS}>
              Role
            </label>
            <select
              id="bulk-role"
              disabled={isRunning}
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className={BULK_OPERATION_INPUT_CLASS}
            >
              {roleOptions.filter((r) => r.value).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label htmlFor="bulk-notes" className={BULK_OPERATION_LABEL_CLASS}>
            Notes (optional)
          </label>
          <textarea
            id="bulk-notes"
            rows={2}
            disabled={isRunning}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className={`${BULK_OPERATION_INPUT_CLASS} min-h-[4rem] resize-y`}
          />
        </div>

        {isSuspend ? (
          <label className="inline-flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              disabled={isRunning}
              checked={effectiveImmediately}
              onChange={(event) => setEffectiveImmediately(event.target.checked)}
              className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-gold-500"
            />
            Effective immediately
          </label>
        ) : null}

        {requiresConfirm ? (
          <div>
            <label htmlFor="bulk-delete-confirm" className={BULK_OPERATION_LABEL_CLASS}>
              Type {BULK_DELETE_CONFIRMATION} to confirm
            </label>
            <input
              id="bulk-delete-confirm"
              disabled={isRunning}
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
              className={BULK_OPERATION_INPUT_CLASS}
            />
          </div>
        ) : null}

        {isRunning ? (
          <div className="rounded-lg border border-navy-700 bg-navy-900/40 px-4 py-3">
            <p className="text-sm text-gray-300">
              {progress.currentUserName
                ? `Processing ${progress.currentUserName}…`
                : 'Processing users…'}{' '}
              ({progress.completed + progress.failed + progress.skipped} / {progress.total})
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-700">
              <div
                className="h-full bg-gold-500 transition-all duration-300"
                style={{
                  width: `${
                    progress.total === 0
                      ? 0
                      : ((progress.completed + progress.failed + progress.skipped) / progress.total) * 100
                  }%`,
                }}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
              <span>Completed: {progress.completed}</span>
              <span>Failed: {progress.failed}</span>
              <span>Skipped: {progress.skipped}</span>
            </div>
          </div>
        ) : null}

        {showResults ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">Results</p>
              <button
                type="button"
                onClick={handleExportResults}
                className="text-xs text-gold-400 hover:text-gold-300"
              >
                Export results CSV
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-navy-700">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-navy-800 text-gray-500">
                  <tr>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.results.map((result) => (
                    <tr key={`${result.userId}-${result.status}`} className="border-t border-navy-700/80">
                      <td className="px-3 py-2 text-gray-200">{result.name ?? result.email ?? result.userId}</td>
                      <td className="px-3 py-2">
                        <span
                          className={
                            result.status === 'success'
                              ? 'text-emerald-400'
                              : result.status === 'skipped'
                                ? 'text-amber-400'
                                : 'text-red-400'
                          }
                        >
                          {result.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">{result.reason ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          {isRunning ? (
            <button
              type="button"
              onClick={() => void cancel()}
              className="inline-flex min-h-10 items-center rounded-lg border border-red-500/40 px-4 text-sm text-red-300 hover:bg-red-500/10"
            >
              Cancel
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={close}
                className="inline-flex min-h-10 items-center rounded-lg border border-navy-600 px-4 text-sm text-gray-300 hover:bg-navy-700"
              >
                Close
              </button>
              {!showResults ? (
                <PrimaryButton placeholder interactive disabled={!canSubmit} onClick={handleConfirm}>
                  Confirm
                </PrimaryButton>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
});

export default BulkOperationDialog;
