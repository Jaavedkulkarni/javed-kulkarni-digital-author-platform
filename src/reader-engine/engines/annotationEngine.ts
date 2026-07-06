import type { BookmarkEngine } from './bookmarkEngine';
import type { HighlightEngine } from './highlightEngine';
import type { NotesEngine } from './notesEngine';
import type { BookAnnotations } from '../types/annotation.types';

export class AnnotationEngine {
  constructor(
    private readonly bookmarks: BookmarkEngine,
    private readonly highlights: HighlightEngine,
    private readonly notes: NotesEngine
  ) {}

  async loadAll(userId: string, bookId: string): Promise<BookAnnotations> {
    const [bookmarks, highlights, notes] = await Promise.all([
      this.bookmarks.list(userId, bookId),
      this.highlights.list(userId, bookId),
      this.notes.list(userId, bookId),
    ]);
    return { bookId, bookmarks, highlights, notes };
  }
}

export function createAnnotationEngine(
  bookmarks: BookmarkEngine,
  highlights: HighlightEngine,
  notes: NotesEngine
): AnnotationEngine {
  return new AnnotationEngine(bookmarks, highlights, notes);
}
