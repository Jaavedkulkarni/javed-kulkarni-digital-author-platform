import { useQuery } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';

export function useAuthorMedia() {
  const { authorId } = useAuthorContext();
  const { media } = useAuthorServices();

  return useQuery({
    queryKey: authorQueryKeys.media(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(media.list(authorId!)),
    enabled: Boolean(authorId),
  });
}
