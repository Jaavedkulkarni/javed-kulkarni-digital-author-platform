import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';
import type { ExportFormat } from '../types/common';

export function useAuthorImportExport() {
  const { authorId } = useAuthorContext();
  const { importExport } = useAuthorServices();
  const queryClient = useQueryClient();

  const importsQuery = useQuery({
    queryKey: authorQueryKeys.importJobs(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(importExport.getImportJobs(authorId!)),
    enabled: Boolean(authorId),
  });

  const exportsQuery = useQuery({
    queryKey: authorQueryKeys.exportJobs(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(importExport.getExportJobs(authorId!)),
    enabled: Boolean(authorId),
  });

  const exportMutation = useMutation({
    mutationFn: (input: { type: 'royalties' | 'sales' | 'analytics' | 'payouts' | 'performance'; format?: ExportFormat }) =>
      importExport.prepareExport({ authorId: authorId!, type: input.type, format: input.format }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.exportJobs(authorId!) }),
  });

  const importMutation = useMutation({
    mutationFn: (input: { type: 'books' | 'sales' | 'analytics'; filename: string }) =>
      Promise.resolve(importExport.queueImport(authorId!, input.type, input.filename)),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.importJobs(authorId!) }),
  });

  return {
    importJobs: importsQuery.data ?? [],
    exportJobs: exportsQuery.data ?? [],
    prepareExport: exportMutation.mutateAsync,
    queueImport: importMutation.mutateAsync,
    isExporting: exportMutation.isPending,
  };
}
