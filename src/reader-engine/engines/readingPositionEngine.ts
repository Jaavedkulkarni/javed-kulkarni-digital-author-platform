import type { EngineReadingProgressRepository } from '../repositories/readingProgressRepository';
import type { PositionUpdateInput, ReadingPosition, ReadingProgressStats } from '../types/position.types';
import type { DigitalFormat } from '../../types/database';
import { mapProgressRow } from '../mappers/position.mapper';
import {
  calculateProgressPercent,
  calculateWordsRemaining,
  estimateMinutesLeft,
} from '../utils/readingTime';

export class ReadingPositionEngine {
  constructor(private readonly repo: EngineReadingProgressRepository) {}

  async getPosition(userId: string, bookId: string): Promise<ReadingPosition | null> {
    const row = await this.repo.findByUserAndBook(userId, bookId);
    return row ? mapProgressRow(row) : null;
  }

  async updatePosition(input: PositionUpdateInput, format: DigitalFormat = 'epub'): Promise<ReadingPosition> {
    const row = await this.repo.upsertProgress({
      user_id: input.userId,
      book_id: input.bookId,
      format,
      chapter_id: input.location.chapterId ?? null,
      current_page: input.location.pageNumber ?? null,
      current_chapter_number: input.location.chapterNumber ?? null,
      progress_percent: input.progressPercent,
      words_read: input.wordsRead ?? 0,
      reading_time_seconds: input.readingTimeSeconds ?? 0,
      is_completed: input.isCompleted ?? input.progressPercent >= 100,
      completed_at: input.isCompleted ? new Date().toISOString() : null,
      last_read_at: new Date().toISOString(),
      device_info: input.deviceInfo ?? {},
    });
    return mapProgressRow(row);
  }

  computeStats(wordsRead: number, totalWords: number): ReadingProgressStats {
    const progressPercent = calculateProgressPercent(wordsRead, totalWords);
    const wordsRemaining = calculateWordsRemaining(wordsRead, totalWords);
    return {
      progressPercent,
      wordsRemaining,
      estimatedMinutesLeft: estimateMinutesLeft(wordsRemaining),
      totalWords,
      wordsRead,
    };
  }
}

export function createReadingPositionEngine(
  repo: EngineReadingProgressRepository
): ReadingPositionEngine {
  return new ReadingPositionEngine(repo);
}
