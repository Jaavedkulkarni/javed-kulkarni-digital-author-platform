import type { ReadingStatistics, BookReadingStats, SessionTimeEntry } from '../types/statistics.types';
import type { ReadingProgress } from '../../types/database';

export class StatisticsEngine {
  buildUserStats(progressRows: ReadingProgress[]): ReadingStatistics {
    const completed = progressRows.filter((r) => r.is_completed);
    const inProgress = progressRows.filter((r) => !r.is_completed && Number(r.progress_percent) > 0);

    return {
      totalBooksRead: completed.length,
      totalReadingTimeSeconds: progressRows.reduce((s, r) => s + r.reading_time_seconds, 0),
      totalWordsRead: progressRows.reduce((s, r) => s + r.words_read, 0),
      averageProgressPercent:
        progressRows.length > 0
          ? Math.round(
              progressRows.reduce((s, r) => s + Number(r.progress_percent), 0) / progressRows.length
            )
          : 0,
      booksInProgress: inProgress.length,
      booksCompleted: completed.length,
      currentStreakDays: 0,
    };
  }

  buildBookStats(row: ReadingProgress): BookReadingStats {
    return {
      bookId: row.book_id,
      progressPercent: Number(row.progress_percent),
      wordsRead: row.words_read,
      readingTimeSeconds: row.reading_time_seconds,
      sessionsCount: 1,
      lastReadAt: row.last_read_at,
      isCompleted: row.is_completed,
    };
  }

  aggregateSessionTime(entries: SessionTimeEntry[]): number {
    return entries.reduce((sum, e) => sum + e.durationSeconds, 0);
  }
}

export function createStatisticsEngine(): StatisticsEngine {
  return new StatisticsEngine();
}
