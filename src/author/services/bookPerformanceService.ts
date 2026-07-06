import type { AuthorAnalyticsService } from './analyticsService';
import type { AuthorSocialService } from './socialService';
import type { BookPerformanceDashboard } from '../types/performance.types';
import type { AnalyticsDateRange } from '../types/analytics.types';

export class BookPerformanceService {
  constructor(
    private readonly analytics: AuthorAnalyticsService,
    private readonly social: AuthorSocialService
  ) {}

  async getDashboard(authorId: string, range?: AnalyticsDateRange): Promise<BookPerformanceDashboard[]> {
    const summary = await this.analytics.getSummary(authorId, range);
    const reviews = this.social.getReviews(authorId);

    return summary.byBook
      .map((book, index) => {
        const bookReviews = reviews.filter((r) => r.bookId === book.bookId);
        const avgRating =
          bookReviews.length > 0
            ? bookReviews.reduce((s, r) => s + r.rating, 0) / bookReviews.length
            : 0;

        return {
          ...book,
          rank: index + 1,
          trendDirection: (book.conversionRate > 5 ? 'up' : book.reads > 0 ? 'stable' : 'down') as BookPerformanceDashboard['trendDirection'],
          trendPercent: book.conversionRate,
          lastSaleAt: book.booksSold > 0 ? new Date().toISOString() : null,
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: bookReviews.length,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }

  async getBookPerformance(authorId: string, bookId: string, range?: AnalyticsDateRange) {
    const metrics = await this.analytics.getBookAnalytics(authorId, bookId, range);
    if (!metrics) return null;

    const reviews = this.social.getBookReviews(bookId);
    const avgRating =
      reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

    return {
      ...metrics,
      rank: 1,
      trendDirection: 'stable' as const,
      trendPercent: metrics.conversionRate,
      lastSaleAt: metrics.booksSold > 0 ? new Date().toISOString() : null,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    };
  }
}

export function createBookPerformanceService(
  analytics: AuthorAnalyticsService,
  socialService: AuthorSocialService
): BookPerformanceService {
  return new BookPerformanceService(analytics, socialService);
}
