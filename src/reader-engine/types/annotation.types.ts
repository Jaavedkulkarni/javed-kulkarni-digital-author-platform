import type { ReaderBookmark } from './bookmark.types';
import type { ReaderHighlight } from './highlight.types';
import type { ReaderNote } from './note.types';

export type AnnotationType = 'bookmark' | 'highlight' | 'note';

export type ReaderAnnotation =
  | { type: 'bookmark'; data: ReaderBookmark }
  | { type: 'highlight'; data: ReaderHighlight }
  | { type: 'note'; data: ReaderNote };

export interface BookAnnotations {
  bookId: string;
  bookmarks: ReaderBookmark[];
  highlights: ReaderHighlight[];
  notes: ReaderNote[];
}
