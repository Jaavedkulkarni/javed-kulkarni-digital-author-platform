import { useCallback, useMemo, useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { mapEdgeFunctionInvokeError } from '../../../lib/edge-functions';
import { useInvalidatePeople } from '../hooks';
import { getImportExportService } from './import-export.service';
import type { ImportPreviewSummary, ImportRowResult } from './import-export.types';
import { downloadExportFile, downloadTemplate, guessColumnMapping, parseImportFile } from './utils/file-utils';

export function usePeopleImport(onComplete?: () => void) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'result'>('upload');
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<ImportPreviewSummary | null>(null);
  const [results, setResults] = useState<ImportRowResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { invalidateEverything, invalidateStats, invalidateFilters } = useInvalidatePeople();
  const service = useMemo(() => getImportExportService(), []);

  const reset = useCallback(() => {
    setStep('upload');
    setFileName('');
    setRows([]);
    setHeaders([]);
    setColumnMapping({});
    setSummary(null);
    setResults([]);
    setIsLoading(false);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const openImport = useCallback(() => {
    reset();
    setOpen(true);
  }, [reset]);

  const handleFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const parsed = await parseImportFile(file);
        const fileHeaders = Object.keys(parsed[0] ?? {});
        setRows(parsed);
        setHeaders(fileHeaders);
        setColumnMapping(guessColumnMapping(fileHeaders));
        setFileName(file.name);
        setStep('mapping');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Unable to parse import file');
      } finally {
        setIsLoading(false);
      }
    },
    [showToast],
  );

  const preview = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await service.previewImport(rows, columnMapping);
      setSummary(response.summary);
      setResults(response.results);
      setStep('preview');
    } catch (error) {
      const message = (await mapEdgeFunctionInvokeError(error).catch(() => null)) ?? 'Import preview failed';
      showToast(message);
    } finally {
      setIsLoading(false);
    }
  }, [columnMapping, rows, service, showToast]);

  const execute = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await service.executeImport(rows, { columnMapping, partialImport: true });
      setSummary(response.summary);
      setResults(response.results);
      setStep('result');
      await Promise.all([invalidateEverything(), invalidateStats(), invalidateFilters()]);
      onComplete?.();
      showToast(`${response.summary.imported ?? 0} users imported`);
    } catch (error) {
      const message = (await mapEdgeFunctionInvokeError(error).catch(() => null)) ?? 'Import failed';
      showToast(message);
    } finally {
      setIsLoading(false);
    }
  }, [columnMapping, invalidateEverything, invalidateFilters, invalidateStats, onComplete, rows, service, showToast]);

  return {
    open,
    step,
    fileName,
    headers,
    columnMapping,
    summary,
    results,
    isLoading,
    openImport,
    close,
    handleFile,
    setColumnMapping,
    preview,
    execute,
    downloadTemplate,
  };
}

export function usePeopleExport() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const service = useMemo(() => getImportExportService(), []);

  const openExport = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const runExport = useCallback(
    async (params: {
      format: 'csv' | 'xlsx' | 'pdf';
      scope: 'selected' | 'filtered' | 'all' | 'visible';
      userIds?: string[];
      filters?: Record<string, unknown>;
      columns: string[];
    }) => {
      setIsLoading(true);
      try {
        let response = await service.exportUsers(params);
        if (response.async && response.jobId) {
          const jobId = response.jobId;
          for (let attempt = 0; attempt < 30; attempt += 1) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            response = await service.getExportJobStatus(jobId);
            if (response.status === 'completed' && response.rows) break;
            if (response.status === 'failed') throw new Error(response.error ?? 'Export job failed');
          }
        }
        if (!response.rows?.length) {
          showToast('No rows to export');
          return;
        }
        downloadExportFile(
          params.format,
          response.columns ?? params.columns,
          response.rows,
          `people-export-${Date.now()}`,
        );
        showToast('Export downloaded');
        close();
      } catch (error) {
        const message = (await mapEdgeFunctionInvokeError(error).catch(() => null)) ?? 'Export failed';
        showToast(message);
      } finally {
        setIsLoading(false);
      }
    },
    [close, service, showToast],
  );

  return { open, isLoading, openExport, close, runExport };
}
