import type { Tables } from '../../types/database';
import type { ReaderBookmark } from '../types/bookmark.types';
import type { ReaderLocation } from '../types/common';

function mapLocation(row: {
  chapter_id: string | null;
  page_number: number | null;
  position_percent: number | null;
  cfi_location?: string | null;
}): ReaderLocation {
  return {
    chapterId: row.chapter_id,
    pageNumber: row.page_number,
    positionPercent: row.position_percent,
    cfi: row.cfi_location ?? null,
  };
}

export function mapBookmarkRow(row: Tables<'bookmarks'>): ReaderBookmark {
  return {
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    label: row.label,
    note: row.note,
    color: row.color ?? '#b8860b',
    isAuto: row.is_auto,
    location: mapLocation(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
