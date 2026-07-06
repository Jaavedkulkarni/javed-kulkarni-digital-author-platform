import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';
import type { AuthorBlogFilters, CreateArticleInput } from '../types/blog.types';

export function useAuthorBlog(filters?: AuthorBlogFilters) {
  const { authorId, displayName } = useAuthorContext();
  const { blog } = useAuthorServices();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: authorQueryKeys.blog(authorId ?? 'guest'),
    queryFn: () => blog.list(displayName ?? '', filters),
    enabled: Boolean(displayName),
  });

  const createMutation = useMutation({
    mutationFn: (input: Omit<CreateArticleInput, 'authorName'>) =>
      blog.create({ ...input, authorName: displayName! }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: authorQueryKeys.blog(authorId!) }),
  });

  return {
    articles: query.data ?? [],
    isLoading: query.isLoading,
    createArticle: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
