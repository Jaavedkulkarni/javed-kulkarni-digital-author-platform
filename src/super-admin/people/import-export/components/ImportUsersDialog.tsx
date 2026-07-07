import { memo, useRef } from 'react';
import { PrimaryButton } from '../../../../components/shared/buttons/PrimaryButton';
import { Modal } from '../../../../components/ui/Modal';
import { IMPORT_TEMPLATE_COLUMNS } from '../import-export.types';
import type { usePeopleImport } from '../import-export.hooks';

type ImportController = ReturnType<typeof usePeopleImport>;

interface ImportUsersDialogProps {
  controller: ImportController;
}

export const ImportUsersDialog = memo(function ImportUsersDialog({ controller }: ImportUsersDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    open,
    step,
    fileName,
    headers,
    columnMapping,
    summary,
    results,
    isLoading,
    close,
    handleFile,
    setColumnMapping,
    preview,
    execute,
    downloadTemplate,
  } = controller;

  if (!open) return null;

  return (
    <Modal title="Import Users" onClose={isLoading ? () => undefined : close} maxWidth="lg">
      <div className="space-y-4">
        {step === 'upload' ? (
          <>
            <p className="text-sm text-gray-400">Upload a CSV or Excel file. Download a template to get started.</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => downloadTemplate('csv')}
                className="rounded-lg border border-navy-600 px-3 py-2 text-xs text-gray-300 hover:bg-navy-700"
              >
                Download CSV Template
              </button>
              <button
                type="button"
                onClick={() => downloadTemplate('xlsx')}
                className="rounded-lg border border-navy-600 px-3 py-2 text-xs text-gray-300 hover:bg-navy-700"
              >
                Download Excel Template
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
            <PrimaryButton placeholder interactive onClick={() => fileInputRef.current?.click()}>
              Choose File
            </PrimaryButton>
          </>
        ) : null}

        {step === 'mapping' ? (
          <>
            <p className="text-sm text-gray-400">
              Map columns from <span className="text-white">{fileName}</span> to user fields.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {IMPORT_TEMPLATE_COLUMNS.map((column) => (
                <label key={column} className="block text-xs text-gray-400">
                  {column}
                  <select
                    value={columnMapping[column] ?? column}
                    onChange={(event) =>
                      setColumnMapping({ ...columnMapping, [column]: event.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-navy-600 bg-navy-900/60 px-2 py-2 text-sm text-gray-200"
                  >
                    <option value="">— Skip —</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <PrimaryButton placeholder interactive disabled={isLoading} onClick={() => void preview()}>
              Preview Import
            </PrimaryButton>
          </>
        ) : null}

        {step === 'preview' && summary ? (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div className="rounded-lg border border-navy-700 bg-navy-900/40 p-3">Total: {summary.total}</div>
              <div className="rounded-lg border border-navy-700 bg-navy-900/40 p-3 text-emerald-400">Valid: {summary.valid}</div>
              <div className="rounded-lg border border-navy-700 bg-navy-900/40 p-3 text-red-400">Invalid: {summary.invalid}</div>
              <div className="rounded-lg border border-navy-700 bg-navy-900/40 p-3 text-amber-400">Duplicates: {summary.duplicates}</div>
            </div>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-navy-700">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-navy-800 text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 100).map((row) => (
                    <tr key={row.rowIndex} className="border-t border-navy-700/80">
                      <td className="px-3 py-2">{row.rowIndex + 1}</td>
                      <td className="px-3 py-2">{row.email}</td>
                      <td className="px-3 py-2">{row.status}</td>
                      <td className="px-3 py-2 text-gray-500">{row.reason ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PrimaryButton placeholder interactive disabled={isLoading || summary.valid === 0} onClick={() => void execute()}>
              Import Valid Rows
            </PrimaryButton>
          </>
        ) : null}

        {step === 'result' && summary ? (
          <>
            <p className="text-sm text-emerald-400">
              Imported {summary.imported ?? 0} users. Failed: {summary.failed ?? 0}. Skipped: {summary.skipped ?? 0}.
            </p>
            <button type="button" onClick={close} className="text-sm text-gray-300 hover:text-white">
              Close
            </button>
          </>
        ) : null}
      </div>
    </Modal>
  );
});

export default ImportUsersDialog;
