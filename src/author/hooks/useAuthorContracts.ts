import { useQuery } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';

export function useAuthorContracts() {
  const { authorId } = useAuthorContext();
  const { contracts } = useAuthorServices();

  return useQuery({
    queryKey: authorQueryKeys.contracts(authorId ?? 'guest'),
    queryFn: () => Promise.resolve({
      items: contracts.list(authorId!),
      summary: contracts.getSummary(authorId!),
    }),
    enabled: Boolean(authorId),
  });
}
