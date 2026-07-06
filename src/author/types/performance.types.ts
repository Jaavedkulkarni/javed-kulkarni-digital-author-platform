import type { BookAnalyticsMetrics } from './analytics.types';

export interface BookPerformanceDashboard extends BookAnalyticsMetrics {
  rank: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercent: number;
  lastSaleAt: string | null;
  averageRating: number;
  reviewCount: number;
}

export interface BookPerformanceComparison {
  bookId: string;
  bookTitle: string;
  currentPeriod: BookAnalyticsMetrics;
  previousPeriod: BookAnalyticsMetrics;
  deltaReads: number;
  deltaRevenue: number;
}
