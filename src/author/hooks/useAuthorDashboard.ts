import { useQuery } from '@tanstack/react-query';
import { useRoles } from '../../context/RoleContext';
import { authorQueryKeys } from '../query/queryKeys';
import { useAuthorServices } from './useAuthorServices';
import { useAuthorContext } from './useAuthorContext';

export function useAuthorDashboard() {
  const { authorId } = useAuthorContext();
  const { profile } = useRoles();
  const { books, analytics, revenue, social, dashboard, notifications } = useAuthorServices();

  const booksQuery = useQuery({
    queryKey: authorQueryKeys.books(authorId ?? 'guest'),
    queryFn: () => books.list(authorId!),
    enabled: Boolean(authorId),
  });

  const analyticsQuery = useQuery({
    queryKey: authorQueryKeys.analytics(authorId ?? 'guest'),
    queryFn: () => analytics.getSummary(authorId!),
    enabled: Boolean(authorId),
  });

  const revenueQuery = useQuery({
    queryKey: authorQueryKeys.revenue(authorId ?? 'guest'),
    queryFn: () => Promise.resolve(revenue.getSummary(authorId!)),
    enabled: Boolean(authorId),
  });

  const overviewQuery = useQuery({
    queryKey: authorQueryKeys.dashboard(authorId ?? 'guest'),
    queryFn: async () => {
      const allBooks = await books.list(authorId!);
      const analyticsData = await analytics.getSummary(authorId!);
      const revenueData = revenue.getSummary(authorId!);
      const reviewSummary = social.getReviewSummary(authorId!);
      const unread = profile?.id ? await notifications.countUnread(profile.id) : 0;

      return dashboard.getOverview({
        authorId: authorId!,
        totalBooks: allBooks.length,
        publishedBooks: allBooks.filter((b) => b.workflow_status === 'published').length,
        draftBooks: allBooks.filter((b) => b.workflow_status === 'draft').length,
        totalRevenue: revenueData.total || analyticsData.revenue,
        pendingRoyalties: revenueData.pending,
        totalReads: analyticsData.reads,
        followerCount: social.getFollowers(authorId!).length,
        averageRating: reviewSummary.averageRating,
        unreadNotifications: unread,
      });
    },
    enabled: Boolean(authorId),
  });

  return {
    overview: overviewQuery.data,
    books: booksQuery.data ?? [],
    analytics: analyticsQuery.data,
    revenue: revenueQuery.data,
    isLoading: overviewQuery.isLoading,
    refetch: overviewQuery.refetch,
  };
}
