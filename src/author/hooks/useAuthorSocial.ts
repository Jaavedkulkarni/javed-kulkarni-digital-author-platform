import { useQuery } from '@tanstack/react-query';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';

export function useAuthorSocial() {
  const { authorId } = useAuthorContext();
  const { social } = useAuthorServices();

  const followersQuery = useQuery({
    queryKey: authorQueryKeys.followers(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(social.getFollowers(authorId!)),
    enabled: Boolean(authorId),
  });

  const reviewsQuery = useQuery({
    queryKey: authorQueryKeys.reviews(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(social.getReviews(authorId!)),
    enabled: Boolean(authorId),
  });

  return {
    followers: followersQuery.data ?? [],
    reviews: reviewsQuery.data ?? [],
    reviewSummary: authorId ? social.getReviewSummary(authorId) : null,
    isLoading: followersQuery.isLoading || reviewsQuery.isLoading,
  };
}
