import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRoles } from '../../context/RoleContext';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';
import type { AuthorBookListFilters, AuthorCreateBookInput } from '../types/book.types';

export function useAuthorBooks(filters?: AuthorBookListFilters) {
  const { authorId } = useAuthorContext();
  const { profile } = useRoles();
  const { books } = useAuthorServices();
  const queryClient = useQueryClient();
  const filterKey = JSON.stringify(filters ?? {});

  const query = useQuery({
    queryKey: authorQueryKeys.books(authorId ?? 'guest', filterKey),
    queryFn: () => books.list(authorId!, filters),
    enabled: Boolean(authorId),
  });

  const draftsQuery = useQuery({
    queryKey: authorQueryKeys.books(authorId ?? 'guest', 'drafts'),
    queryFn: () => books.getDrafts(authorId!),
    enabled: Boolean(authorId),
  });

  const publishedQuery = useQuery({
    queryKey: authorQueryKeys.books(authorId ?? 'guest', 'published'),
    queryFn: () => books.getPublished(authorId!),
    enabled: Boolean(authorId),
  });

  const createMutation = useMutation({
    mutationFn: (input: Omit<AuthorCreateBookInput, 'authorId' | 'createdBy'>) =>
      books.create({ ...input, authorId: authorId!, createdBy: profile!.id }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: authorQueryKeys.books(authorId!) });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authorQueryKeys.books(authorId!) });
      void queryClient.invalidateQueries({ queryKey: authorQueryKeys.dashboard(authorId!) });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (bookId: string) => books.archive(authorId!, bookId, profile!.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.books(authorId!) }),
  });

  const duplicateMutation = useMutation({
    mutationFn: (sourceBookId: string) =>
      books.duplicate({ sourceBookId, authorId: authorId!, actorId: profile!.id }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.books(authorId!) }),
  });

  return {
    books: query.data ?? [],
    drafts: draftsQuery.data ?? [],
    published: publishedQuery.data ?? [],
    isLoading: query.isLoading,
    createBook: createMutation.mutateAsync,
    archiveBook: archiveMutation.mutateAsync,
    duplicateBook: duplicateMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
