import { memo, useState } from 'react';
import { PrimaryButton } from '../../../../components/shared/buttons/PrimaryButton';
import { Modal } from '../../../../components/ui/Modal';
import { EXPORT_COLUMN_OPTIONS, type ExportScope, type ImportExportFormat } from '../import-export.types';
import type { usePeopleExport } from '../import-export.hooks';

type ExportController = ReturnType<typeof usePeopleExport>;

interface ExportUsersDialogProps {
  controller: ExportController;
  selectedCount: number;
  visibleColumns: string[];
  filters: Record<string, unknown>;
  selectedUserIds: string[];
}

export const ExportUsersDialog = memo(function ExportUsersDialog({
  controller,
  selectedCount,
  visibleColumns,
  filters,
  selectedUserIds,
}: ExportUsersDialogProps) {
  const { open, isLoading, close, runExport } = controller;
  const [format, setFormat] = useState<ImportExportFormat>('csv');
  const [scope, setScope] = useState<ExportScope>('filtered');
  const [columns, setColumns] = useState<string[]>(
    visibleColumns.length ? visibleColumns : EXPORT_COLUMN_OPTIONS.map((c) => c.id),
  );

  if (!open) return null;

  return (
    <Modal title="Export Users" onClose={isLoading ? () => undefined : close} maxWidth="md">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Format</label>
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value as ImportExportFormat)}
            className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3 py-2 text-sm text-gray-200"
          >
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-400">Scope</label>
          <select
            value={scope}
            onChange={(event) => setScope(event.target.value as ExportScope)}
            className="w-full rounded-lg border border-navy-600 bg-navy-900/60 px-3 py-2 text-sm text-gray-200"
          >
            <option value="filtered">Filtered rows</option>
            <option value="selected" disabled={selectedCount === 0}>
              Selected rows ({selectedCount})
            </option>
            <option value="visible">Visible columns only</option>
            <option value="all">All rows</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs text-gray-400">Columns</p>
          <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-navy-700 p-2">
            {EXPORT_COLUMN_OPTIONS.map((column) => (
              <label key={column.id} className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={columns.includes(column.id)}
                  onChange={(event) => {
                    setColumns((prev) =>
                      event.target.checked
                        ? [...prev, column.id]
                        : prev.filter((id) => id !== column.id),
                    );
                  }}
                  className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-gold-500"
                />
                {column.label}
              </label>
            ))}
          </div>
        </div>

        <PrimaryButton
          placeholder
          interactive
          disabled={isLoading || columns.length === 0}
          onClick={() =>
            void runExport({
              format,
              scope,
              columns,
              filters: scope === 'filtered' ? filters : undefined,
              userIds: scope === 'selected' ? selectedUserIds : undefined,
            })
          }
        >
          {isLoading ? 'Exporting…' : 'Download Export'}
        </PrimaryButton>
      </div>
    </Modal>
  );
});

export default ExportUsersDialog;
