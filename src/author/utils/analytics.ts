import { DEFAULT_ROYALTY_RATE } from '../constants/author.constants';
import type { RoyaltyRecord } from '../types/revenue.types';
import type { RoyaltyStatus } from '../types/common';

export function calculateRoyalty(grossAmount: number, rate = DEFAULT_ROYALTY_RATE): number {
  return Math.round(grossAmount * rate * 100) / 100;
}

export function buildRoyaltyRecord(params: {
  authorId: string;
  bookId: string;
  bookTitle: string;
  orderId: string;
  grossAmount: number;
  status?: RoyaltyStatus;
}): RoyaltyRecord {
  const now = new Date();
  return {
    id: `roy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    authorId: params.authorId,
    bookId: params.bookId,
    bookTitle: params.bookTitle,
    orderId: params.orderId,
    grossAmount: params.grossAmount,
    royaltyRate: DEFAULT_ROYALTY_RATE,
    royaltyAmount: calculateRoyalty(params.grossAmount),
    status: params.status ?? 'pending',
    periodMonth: now.toLocaleString('en', { month: 'short' }),
    periodYear: now.getFullYear(),
    paidAt: null,
    createdAt: now.toISOString(),
  };
}

export function prepareCsvExport(filename: string, columns: string[], rowCount: number) {
  return {
    format: 'csv' as const,
    filename,
    columns,
    rowCount,
    preparedAt: new Date().toISOString(),
    downloadPath: `exports/${filename}`,
  };
}

export function aggregateAnalyticsByBook(
  events: Array<{ book_id: string | null; event_type: string; properties: unknown }>,
  bookTitles: Map<string, string>
) {
  const map = new Map<string, BookAnalyticsAccumulator>();

  for (const event of events) {
    if (!event.book_id) continue;
    const acc = map.get(event.book_id) ?? {
      bookId: event.book_id,
      bookTitle: bookTitles.get(event.book_id) ?? 'Unknown',
      reads: 0,
      purchases: 0,
      downloads: 0,
      wishlists: 0,
      readingTimeMinutes: 0,
      completions: 0,
      bookmarks: 0,
      highlights: 0,
      notes: 0,
    };

    switch (event.event_type) {
      case 'book_open':
        acc.reads += 1;
        break;
      case 'purchase':
        acc.purchases += 1;
        break;
      case 'download_complete':
        acc.downloads += 1;
        break;
      case 'wishlist_add':
        acc.wishlists += 1;
        break;
      case 'chapter_complete':
        acc.completions += 1;
        break;
      default:
        break;
    }

    const props = event.properties as Record<string, unknown> | null;
    if (props?.readingTimeMinutes) acc.readingTimeMinutes += Number(props.readingTimeMinutes);
    if (props?.bookmarks) acc.bookmarks += Number(props.bookmarks);
    if (props?.highlights) acc.highlights += Number(props.highlights);
    if (props?.notes) acc.notes += Number(props.notes);

    map.set(event.book_id, acc);
  }

  return [...map.values()].map((acc) => ({
    bookId: acc.bookId,
    bookTitle: acc.bookTitle,
    booksSold: acc.purchases,
    revenue: acc.purchases * 299,
    reads: acc.reads,
    readingTimeMinutes: acc.readingTimeMinutes,
    completionRate: acc.reads > 0 ? Math.round((acc.completions / acc.reads) * 100) : 0,
    bookmarks: acc.bookmarks,
    highlights: acc.highlights,
    notes: acc.notes,
    downloads: acc.downloads,
    wishlistCount: acc.wishlists,
    conversionRate: acc.reads > 0 ? Math.round((acc.purchases / acc.reads) * 100) : 0,
  }));
}

interface BookAnalyticsAccumulator {
  bookId: string;
  bookTitle: string;
  reads: number;
  purchases: number;
  downloads: number;
  wishlists: number;
  readingTimeMinutes: number;
  completions: number;
  bookmarks: number;
  highlights: number;
  notes: number;
}
