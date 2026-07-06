import type { Book, Category, DigitalFormat, LibraryItem, ReadingProgress } from '../../types/database';
import type { BookFormat } from '../../components/book/bookTypes';

export function mapDigitalFormatToBookFormat(format: DigitalFormat | null | undefined): BookFormat {
  if (format === 'pdf') return 'ebook';
  return 'ebook';
}

export function formatDateLabel(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

export function resolveBookTitle(book: Book | undefined, fallback = 'Untitled'): string {
  return book?.title ?? fallback;
}

export function resolveBookAuthor(book: Book | undefined): string {
  return book?.author_name ?? 'Unknown Author';
}

export function resolveBookCover(book: Book | undefined): string | null {
  return book?.cover_image ?? null;
}

export function resolveBookLanguage(book: Book | undefined): string {
  return book?.primary_language ?? book?.language ?? '—';
}

export function resolveBookCategory(book: Book | undefined, categories: Map<string, Category>): string {
  if (!book?.category_id) return '—';
  return categories.get(book.category_id)?.name ?? '—';
}

export function resolveProgressPercent(
  _libraryItem: LibraryItem | undefined,
  progress: ReadingProgress | undefined
): number {
  if (progress?.progress_percent !== undefined) return Math.round(progress.progress_percent);
  return 0;
}

export function isMembershipSource(source: string | null | undefined): boolean {
  return source === 'membership' || source === 'subscription';
}
