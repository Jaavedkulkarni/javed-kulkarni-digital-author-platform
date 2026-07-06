export interface ReadingStatistics {
  totalBooksRead: number;
  totalReadingTimeSeconds: number;
  totalWordsRead: number;
  averageProgressPercent: number;
  booksInProgress: number;
  booksCompleted: number;
  currentStreakDays: number;
}

export interface BookReadingStats {
  bookId: string;
  progressPercent: number;
  wordsRead: number;
  readingTimeSeconds: number;
  sessionsCount: number;
  lastReadAt: string | null;
  isCompleted: boolean;
}

export interface SessionTimeEntry {
  sessionId: string;
  bookId: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  wordsRead: number;
}
