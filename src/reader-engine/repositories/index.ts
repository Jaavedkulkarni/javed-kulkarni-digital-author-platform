import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createEngineBookmarkRepository, EngineBookmarkRepository } from './bookmarkRepository';
import { createEngineHighlightRepository, EngineHighlightRepository } from './highlightRepository';
import { createEngineNoteRepository, EngineNoteRepository } from './noteRepository';
import { createEngineReadingProgressRepository, EngineReadingProgressRepository } from './readingProgressRepository';
import { createEngineDownloadRepository, EngineDownloadRepository } from './downloadRepository';

export interface ReaderEngineRepositories {
  bookmarks: EngineBookmarkRepository;
  highlights: EngineHighlightRepository;
  notes: EngineNoteRepository;
  readingProgress: EngineReadingProgressRepository;
  downloads: EngineDownloadRepository;
}

export function createReaderEngineRepositories(client: TypedSupabaseClient): ReaderEngineRepositories {
  return {
    bookmarks: createEngineBookmarkRepository(client),
    highlights: createEngineHighlightRepository(client),
    notes: createEngineNoteRepository(client),
    readingProgress: createEngineReadingProgressRepository(client),
    downloads: createEngineDownloadRepository(client),
  };
}
