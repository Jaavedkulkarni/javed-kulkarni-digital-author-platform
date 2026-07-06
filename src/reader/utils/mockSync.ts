import type { MockOrder } from '../../data/mockOrders';
import type { MockLibraryBook } from '../../data/mockLibraryBooks';
import type { MockWishlistBook } from '../../data/mockWishlistBooks';
import type { MockReadingRecord } from '../../data/mockReadingProgress';
import type { MockNotification } from '../../data/mockNotifications';
import { MOCK_ORDERS } from '../../data/mockOrders';
import { MOCK_LIBRARY_BOOKS } from '../../data/mockLibraryBooks';
import { MOCK_WISHLIST_BOOKS } from '../../data/mockWishlistBooks';
import { MOCK_READING_PROGRESS } from '../../data/mockReadingProgress';
import { MOCK_NOTIFICATIONS } from '../../data/mockNotifications';

function replaceArrayContents<T>(target: T[], source: readonly T[]): void {
  target.length = 0;
  target.push(...source);
}

export function syncMockOrders(orders: MockOrder[]): void {
  replaceArrayContents(MOCK_ORDERS, orders);
}

export function syncMockLibraryBooks(books: MockLibraryBook[]): void {
  replaceArrayContents(MOCK_LIBRARY_BOOKS, books);
}

export function syncMockWishlistBooks(books: MockWishlistBook[]): void {
  replaceArrayContents(MOCK_WISHLIST_BOOKS, books);
}

export function syncMockReadingProgress(records: MockReadingRecord[]): void {
  replaceArrayContents(MOCK_READING_PROGRESS, records);
}

export function syncMockNotifications(notifications: MockNotification[]): void {
  replaceArrayContents(MOCK_NOTIFICATIONS, notifications);
}
