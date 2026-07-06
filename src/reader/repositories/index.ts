import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createReaderMembershipRepository, ReaderMembershipRepository } from './membershipRepository';
import { createReaderOrderItemsRepository, ReaderOrderItemsRepository } from './orderItemsRepository';
import { createReaderDownloadRepository, ReaderDownloadRepository } from './downloadRepository';
import { createReaderBookmarkRepository, ReaderBookmarkRepository } from './bookmarkRepository';
import { createReaderNoteRepository, ReaderNoteRepository } from './noteRepository';
import { createReaderHighlightRepository, ReaderHighlightRepository } from './highlightRepository';

export interface ReaderRepositories {
  memberships: ReaderMembershipRepository;
  orderItems: ReaderOrderItemsRepository;
  downloads: ReaderDownloadRepository;
  bookmarks: ReaderBookmarkRepository;
  notes: ReaderNoteRepository;
  highlights: ReaderHighlightRepository;
}

export function createReaderRepositories(client: TypedSupabaseClient): ReaderRepositories {
  return {
    memberships: createReaderMembershipRepository(client),
    orderItems: createReaderOrderItemsRepository(client),
    downloads: createReaderDownloadRepository(client),
    bookmarks: createReaderBookmarkRepository(client),
    notes: createReaderNoteRepository(client),
    highlights: createReaderHighlightRepository(client),
  };
}
