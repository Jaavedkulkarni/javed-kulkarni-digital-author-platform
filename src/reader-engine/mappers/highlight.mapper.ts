import type { Tables } from '../../types/database';
import type { ReaderHighlight } from '../types/highlight.types';
import type { ReaderLocation } from '../types/common';

function mapLocation(row: Tables<'highlights'>): ReaderLocation {
  return {
    chapterId: row.chapter_id,
    pageNumber: row.page_number,
    positionPercent: row.position_start,
    cfiRange: row.cfi_range,
  };
}

export function mapHighlightRow(row: Tables<'highlights'>): ReaderHighlight {
  return {
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    selectedText: row.selected_text,
    note: row.note,
    color: row.color,
    location: mapLocation(row),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
