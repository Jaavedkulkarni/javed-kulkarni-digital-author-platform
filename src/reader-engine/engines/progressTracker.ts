import type { EngineReadingProgressRepository } from '../repositories/readingProgressRepository';
import type { ReadingProgress } from '../../types/database';

export class ProgressTracker {
  constructor(private readonly repo: EngineReadingProgressRepository) {}

  async getAllProgress(userId: string): Promise<ReadingProgress[]> {
    return this.repo.findByUser(userId);
  }

  async markCompleted(userId: string, bookId: string): Promise<ReadingProgress> {
    const existing = await this.repo.findByUserAndBook(userId, bookId);
    return this.repo.upsertProgress({
      user_id: userId,
      book_id: bookId,
      format: existing?.format ?? 'epub',
      progress_percent: 100,
      is_completed: true,
      completed_at: new Date().toISOString(),
      last_read_at: new Date().toISOString(),
      words_read: existing?.words_read ?? 0,
      reading_time_seconds: existing?.reading_time_seconds ?? 0,
    });
  }

  calculateOverallProgress(rows: ReadingProgress[]): number {
    if (rows.length === 0) return 0;
    const sum = rows.reduce((acc, row) => acc + Number(row.progress_percent), 0);
    return Math.round((sum / rows.length) * 100) / 100;
  }
}

export function createProgressTracker(repo: EngineReadingProgressRepository): ProgressTracker {
  return new ProgressTracker(repo);
}
