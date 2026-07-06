import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRoles } from '../../context/RoleContext';
import { platformAdminQueryKeys } from '../query/queryKeys';
import { usePlatformAdminServices } from './usePlatformAdminServices';
import type { ReviewDecision } from '../types/common';

export function useBookReview() {
  const { review } = usePlatformAdminServices();
  const { profile } = useRoles();
  const queryClient = useQueryClient();

  const booksQuery = useQuery({
    queryKey: platformAdminQueryKeys.bookReview(),
    queryFn: async () => ({
      books: await review.getBookQueue(),
      blogs: review.getBlogQueue(),
      copyright: review.getCopyrightReports(),
      featured: review.getFeaturedRequests(),
    }),
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, decision, type }: { id: string; decision: ReviewDecision; type: 'book' | 'blog' }) => {
      if (type === 'book') {
        if (!profile?.id) throw new Error('Reviewer profile required.');
        const result = await review.reviewBook(id, decision, profile.id);
        if (!result.success) throw new Error(result.errors?.join(' ') ?? 'Review failed.');
        return result;
      }
      const result = review.reviewBlog(id, decision);
      if (!result.success) throw new Error(result.errors?.join(' ') ?? 'Review failed.');
      return result;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.bookReview() });
      void queryClient.invalidateQueries({ queryKey: platformAdminQueryKeys.dashboard() });
    },
  });

  return { ...booksQuery.data, isLoading: booksQuery.isLoading, reviewMutation, refetch: booksQuery.refetch };
}
