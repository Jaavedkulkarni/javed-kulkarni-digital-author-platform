import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import { createReaderEngineRepositories } from '../repositories';
import {
  createBookLoader,
  createEpubEngine,
  createPdfEngine,
  createReadingSessionManager,
  createBookmarkEngine,
  createHighlightEngine,
  createNotesEngine,
  createAnnotationEngine,
  createSearchEngine,
  createThemeEngine,
  createFontEngine,
  createLayoutEngine,
  createReadingPositionEngine,
  createProgressTracker,
  createStatisticsEngine,
  createReadingTimeTracker,
  createLastReadTracker,
  createSyncEngine,
  createOfflineCacheManager,
  createDictionaryService,
  createTranslationService,
  createTextSelectionEngine,
} from '../engines';
import type { BookLoader } from '../engines/bookLoader';
import type { EpubEngine } from '../engines/epubEngine';
import type { PdfEngine } from '../engines/pdfEngine';
import type { ReadingSessionManager } from '../engines/readingSessionManager';
import type { BookmarkEngine } from '../engines/bookmarkEngine';
import type { HighlightEngine } from '../engines/highlightEngine';
import type { NotesEngine } from '../engines/notesEngine';
import type { AnnotationEngine } from '../engines/annotationEngine';
import type { SearchEngine } from '../engines/searchEngine';
import type { ThemeEngine } from '../engines/themeEngine';
import type { FontEngine } from '../engines/fontEngine';
import type { LayoutEngine } from '../engines/layoutEngine';
import type { ReadingPositionEngine } from '../engines/readingPositionEngine';
import type { ProgressTracker } from '../engines/progressTracker';
import type { StatisticsEngine } from '../engines/statisticsEngine';
import type { ReadingTimeTracker } from '../engines/readingTimeTracker';
import type { LastReadTracker } from '../engines/lastReadTracker';
import type { SyncEngine } from '../engines/syncEngine';
import type { OfflineCacheManager } from '../engines/offlineCacheManager';
import type { DictionaryService } from '../engines/dictionaryService';
import type { TranslationService } from '../engines/translationService';
import type { TextSelectionEngine } from '../engines/textSelectionEngine';

export interface ReaderEngineServices {
  bookLoader: BookLoader;
  epub: EpubEngine;
  pdf: PdfEngine;
  session: ReadingSessionManager;
  bookmarks: BookmarkEngine;
  highlights: HighlightEngine;
  notes: NotesEngine;
  annotations: AnnotationEngine;
  search: SearchEngine;
  theme: ThemeEngine;
  font: FontEngine;
  layout: LayoutEngine;
  position: ReadingPositionEngine;
  progress: ProgressTracker;
  statistics: StatisticsEngine;
  readingTime: ReadingTimeTracker;
  lastRead: LastReadTracker;
  sync: SyncEngine;
  offline: OfflineCacheManager;
  dictionary: DictionaryService;
  translation: TranslationService;
  textSelection: TextSelectionEngine;
}

export function createReaderEngineServices(client: TypedSupabaseClient): ReaderEngineServices {
  const repos = createReaderEngineRepositories(client);

  const bookmarkEngine = createBookmarkEngine(repos.bookmarks);
  const highlightEngine = createHighlightEngine(repos.highlights);
  const notesEngine = createNotesEngine(repos.notes);

  return {
    bookLoader: createBookLoader(client),
    epub: createEpubEngine(),
    pdf: createPdfEngine(),
    session: createReadingSessionManager(),
    bookmarks: bookmarkEngine,
    highlights: highlightEngine,
    notes: notesEngine,
    annotations: createAnnotationEngine(bookmarkEngine, highlightEngine, notesEngine),
    search: createSearchEngine(),
    theme: createThemeEngine(),
    font: createFontEngine(),
    layout: createLayoutEngine(),
    position: createReadingPositionEngine(repos.readingProgress),
    progress: createProgressTracker(repos.readingProgress),
    statistics: createStatisticsEngine(),
    readingTime: createReadingTimeTracker(),
    lastRead: createLastReadTracker(repos.readingProgress),
    sync: createSyncEngine(),
    offline: createOfflineCacheManager(repos.downloads),
    dictionary: createDictionaryService(),
    translation: createTranslationService(),
    textSelection: createTextSelectionEngine(),
  };
}
