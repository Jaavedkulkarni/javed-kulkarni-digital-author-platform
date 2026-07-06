import type { EngineBookmarkRepository } from '../repositories/bookmarkRepository';
import type { CreateBookmarkInput, ReaderBookmark, UpdateBookmarkInput } from '../types/bookmark.types';
import { mapBookmarkRow } from '../mappers/bookmark.mapper';
import { validateCreateBookmark } from '../validators/bookmarkValidator';
import { DEFAULT_BOOKMARK_COLOR } from '../constants/readerEngine.constants';

export class BookmarkEngine {
  constructor(private readonly repo: EngineBookmarkRepository) {}

  async list(userId: string, bookId: string): Promise<ReaderBookmark[]> {
    const rows = await this.repo.findByUserAndBook(userId, bookId);
    return rows.map(mapBookmarkRow);
  }

  async create(input: CreateBookmarkInput): Promise<{ bookmark?: ReaderBookmark; errors?: string[] }> {
    const validation = validateCreateBookmark(input);
    if (!validation.valid) return { errors: validation.errors };

    const row = await this.repo.createBookmark({
      user_id: input.userId,
      book_id: input.bookId,
      label: input.label ?? null,
      note: input.note ?? null,
      color: input.color ?? DEFAULT_BOOKMARK_COLOR,
      is_auto: input.isAuto ?? false,
      chapter_id: input.location.chapterId ?? null,
      page_number: input.location.pageNumber ?? null,
      position_percent: input.location.positionPercent ?? null,
      cfi_location: input.location.cfi ?? null,
    });

    return { bookmark: mapBookmarkRow(row) };
  }

  async update(input: UpdateBookmarkInput): Promise<ReaderBookmark> {
    const row = await this.repo.updateBookmark(input.id, {
      label: input.label,
      note: input.note,
      color: input.color,
    });
    return mapBookmarkRow(row);
  }

  async remove(id: string): Promise<void> {
    await this.repo.softDeleteBookmark(id);
  }
}

export function createBookmarkEngine(repo: EngineBookmarkRepository): BookmarkEngine {
  return new BookmarkEngine(repo);
}
