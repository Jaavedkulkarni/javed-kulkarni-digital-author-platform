import type { TypedSupabaseClient } from '../supabase/clients/browser';
import { createProfileRepository, ProfileRepository } from './profileRepository';
import { createBookRepository, BookRepository } from './bookRepository';
import { createCategoryRepository, CategoryRepository } from './categoryRepository';
import { createLibraryRepository, LibraryRepository } from './libraryRepository';
import { createWishlistRepository, WishlistRepository } from './wishlistRepository';
import { createOrderRepository, OrderRepository } from './orderRepository';
import { createNotificationRepository, NotificationRepository } from './notificationRepository';
import { createUserSettingsRepository, UserSettingsRepository } from './userSettingsRepository';
import { createReadingProgressRepository, ReadingProgressRepository } from './readingProgressRepository';

export interface RepositoryRegistry {
  profiles: ProfileRepository;
  books: BookRepository;
  categories: CategoryRepository;
  library: LibraryRepository;
  wishlist: WishlistRepository;
  orders: OrderRepository;
  notifications: NotificationRepository;
  userSettings: UserSettingsRepository;
  readingProgress: ReadingProgressRepository;
}

export function createRepositories(client: TypedSupabaseClient): RepositoryRegistry {
  return {
    profiles: createProfileRepository(client),
    books: createBookRepository(client),
    categories: createCategoryRepository(client),
    library: createLibraryRepository(client),
    wishlist: createWishlistRepository(client),
    orders: createOrderRepository(client),
    notifications: createNotificationRepository(client),
    userSettings: createUserSettingsRepository(client),
    readingProgress: createReadingProgressRepository(client),
  };
}

export { BaseRepository } from './baseRepository';
export type { RepositoryOptions, RepositoryClient } from './baseRepository';

export { ProfileRepository, createProfileRepository } from './profileRepository';
export { BookRepository, createBookRepository } from './bookRepository';
export { CategoryRepository, createCategoryRepository } from './categoryRepository';
export { LibraryRepository, createLibraryRepository } from './libraryRepository';
export { WishlistRepository, createWishlistRepository } from './wishlistRepository';
export { OrderRepository, createOrderRepository } from './orderRepository';
export { NotificationRepository, createNotificationRepository } from './notificationRepository';
export { UserSettingsRepository, createUserSettingsRepository } from './userSettingsRepository';
export { ReadingProgressRepository, createReadingProgressRepository } from './readingProgressRepository';
