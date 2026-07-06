import type { Tables } from '../../types/database';
import type { ReaderNote } from '../types/note.types';
import type { ReaderLocation } from '../types/common';

function mapLocation(row: Tables<'notes'>): ReaderLocation {
  return {
    chapterId: row.chapter_id,
    pageNumber: row.page_number,
    positionPercent: row.position_percent,
    cfi: row.cfi_location,
  };
}

export function mapNoteRow(row: Tables<'notes'>): ReaderNote {
  return {
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    title: row.title,
    content: row.content,
    isPinned: row.is_pinned,
    location: mapLocation(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
