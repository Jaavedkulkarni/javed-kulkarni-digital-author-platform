import { useQuery } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';

export function useAuthorRevenue() {
  const { authorId } = useAuthorContext();
  const { revenue } = useAuthorServices();

  const summaryQuery = useQuery({
    queryKey: authorQueryKeys.revenue(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(revenue.getSummary(authorId!)),
    enabled: Boolean(authorId),
  });

  const salesReport = authorId ? revenue.getSalesReport(authorId) : [];

  return {
    summary: summaryQuery.data,
    royalties: authorId ? revenue.getRoyalties(authorId) : [],
    salesReport,
    prepareExport: (type: 'royalties' | 'sales') =>
      authorId ? revenue.prepareExport(authorId, type) : null,
    isLoading: summaryQuery.isLoading,
  };
}
