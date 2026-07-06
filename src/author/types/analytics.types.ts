export interface BookAnalyticsMetrics {
  bookId: string;
  bookTitle: string;
  booksSold: number;
  revenue: number;
  reads: number;
  readingTimeMinutes: number;
  completionRate: number;
  bookmarks: number;
  highlights: number;
  notes: number;
  downloads: number;
  wishlistCount: number;
  conversionRate: number;
}

export interface AuthorAnalyticsSummary {
  booksSold: number;
  revenue: number;
  reads: number;
  readingTimeMinutes: number;
  completionRate: number;
  bookmarks: number;
  highlights: number;
  notes: number;
  downloads: number;
  wishlistCount: number;
  conversionRate: number;
  topCountries: Array<{ country: string; count: number }>;
  topLanguages: Array<{ language: string; count: number }>;
  returningReaders: number;
  byBook: BookAnalyticsMetrics[];
}

export interface AnalyticsDateRange {
  from?: string;
  to?: string;
}
