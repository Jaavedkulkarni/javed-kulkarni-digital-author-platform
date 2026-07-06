import type { ReadingProgress } from '../../types/database';
import type { ReadingPosition } from '../types/position.types';
import type { ReaderLocation } from '../types/common';

export function mapProgressRow(row: ReadingProgress): ReadingPosition {
  const location: ReaderLocation = {
    chapterId: row.chapter_id,
    chapterNumber: row.current_chapter_number,
    pageNumber: row.current_page,
    positionPercent: row.progress_percent,
  };

  return {
    bookId: row.book_id,
    userId: row.user_id,
    location,
    progressPercent: Number(row.progress_percent),
    wordsRead: row.words_read,
    readingTimeSeconds: row.reading_time_seconds,
    isCompleted: row.is_completed,
    lastReadAt: row.last_read_at,
  };
}
