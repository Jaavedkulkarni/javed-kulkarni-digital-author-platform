import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createAuthorProfileRepository, AuthorProfileRepository } from './authorRepository';
import { createAuthorBookRepository, AuthorBookRepository } from './bookRepository';
import { createAuthorAnalyticsRepository, AuthorAnalyticsRepository } from './analyticsRepository';
import { createAuthorBlogRepository, AuthorBlogRepository } from './blogRepository';
import { createAuthorNotificationRepository, AuthorNotificationRepository } from './notificationRepository';

export interface AuthorRepositories {
  profile: AuthorProfileRepository;
  books: AuthorBookRepository;
  analytics: AuthorAnalyticsRepository;
  blog: AuthorBlogRepository;
  notifications: AuthorNotificationRepository;
}

export function createAuthorRepositories(client: TypedSupabaseClient): AuthorRepositories {
  return {
    profile: createAuthorProfileRepository(client),
    books: createAuthorBookRepository(client),
    analytics: createAuthorAnalyticsRepository(client),
    blog: createAuthorBlogRepository(client),
    notifications: createAuthorNotificationRepository(client),
  };
}
