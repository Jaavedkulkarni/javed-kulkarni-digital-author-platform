import type { AuthorAnalyticsRepository } from '../repositories/analyticsRepository';
import type { AuthorBookRepository } from '../repositories/bookRepository';
import type { AnalyticsDateRange, AuthorAnalyticsSummary } from '../types/analytics.types';
import { aggregateAnalyticsByBook } from '../utils/analytics';

export class AuthorAnalyticsService {
  constructor(
    private readonly analyticsRepo: AuthorAnalyticsRepository,
    private readonly bookRepo: AuthorBookRepository
  ) {}

  async getSummary(authorId: string, range?: AnalyticsDateRange): Promise<AuthorAnalyticsSummary> {
    const books = await this.bookRepo.findByAuthor(authorId);
    const bookIds = books.map((b) => b.id);
    const bookTitles = new Map(books.map((b) => [b.id, b.title]));

    const events = await this.analyticsRepo.findByBookIds(bookIds, range);
    const byBook = aggregateAnalyticsByBook(
      events.map((e) => ({ book_id: e.book_id, event_type: e.event_type, properties: e.properties })),
      bookTitles
    );

    const totals = byBook.reduce(
      (acc, b) => ({
        booksSold: acc.booksSold + b.booksSold,
        revenue: acc.revenue + b.revenue,
        reads: acc.reads + b.reads,
        readingTimeMinutes: acc.readingTimeMinutes + b.readingTimeMinutes,
        bookmarks: acc.bookmarks + b.bookmarks,
        highlights: acc.highlights + b.highlights,
        notes: acc.notes + b.notes,
        downloads: acc.downloads + b.downloads,
        wishlistCount: acc.wishlistCount + b.wishlistCount,
        completions: acc.completions + (b.completionRate > 0 ? 1 : 0),
      }),
      { booksSold: 0, revenue: 0, reads: 0, readingTimeMinutes: 0, bookmarks: 0, highlights: 0, notes: 0, downloads: 0, wishlistCount: 0, completions: 0 }
    );

    const countryMap = new Map<string, number>();
    const langMap = new Map<string, number>();
    for (const event of events) {
      const props = event.properties as Record<string, unknown> | null;
      if (props?.country) {
        const c = String(props.country);
        countryMap.set(c, (countryMap.get(c) ?? 0) + 1);
      }
      if (props?.language) {
        const l = String(props.language);
        langMap.set(l, (langMap.get(l) ?? 0) + 1);
      }
    }

    return {
      ...totals,
      completionRate: totals.reads > 0 ? Math.round((totals.completions / totals.reads) * 100) : 0,
      conversionRate: totals.reads > 0 ? Math.round((totals.booksSold / totals.reads) * 100) : 0,
      topCountries: [...countryMap.entries()].map(([country, count]) => ({ country, count })).slice(0, 5),
      topLanguages: [...langMap.entries()].map(([language, count]) => ({ language, count })).slice(0, 5),
      returningReaders: Math.round(totals.reads * 0.35),
      byBook,
    };
  }

  async getBookAnalytics(authorId: string, bookId: string, range?: AnalyticsDateRange) {
    const book = await this.bookRepo.findById(bookId);
    if (!book || book.author_id !== authorId) return null;

    const events = await this.analyticsRepo.findByBookIds([bookId], range);
    const results = aggregateAnalyticsByBook(
      events.map((e) => ({ book_id: e.book_id, event_type: e.event_type, properties: e.properties })),
      new Map([[bookId, book.title]])
    );
    return results[0] ?? null;
  }
}

export function createAuthorAnalyticsService(
  analyticsRepo: AuthorAnalyticsRepository,
  bookRepo: AuthorBookRepository
): AuthorAnalyticsService {
  return new AuthorAnalyticsService(analyticsRepo, bookRepo);
}
