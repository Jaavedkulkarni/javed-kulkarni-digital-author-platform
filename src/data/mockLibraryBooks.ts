import type { BookFormat } from '../components/book/bookTypes';

export interface MockLibraryBook {
  id: string;
  title: string;
  author: string;
  cover: string | null;
  language: string;
  category: string;
  format: BookFormat;
  purchaseDate: string;
  progress: number;
  downloaded: boolean;
  completed: boolean;
  membership: boolean;
  lastOpened: string | null;
}

/** Synced at runtime by reader data layer. */
export const MOCK_LIBRARY_BOOKS: MockLibraryBook[] = [];
