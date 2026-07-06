import type { EngineReadingProgressRepository } from '../repositories/readingProgressRepository';
import type { ReadingProgress } from '../../types/database';

export class LastReadTracker {
  constructor(private readonly repo: EngineReadingProgressRepository) {}

  async getLastRead(userId: string): Promise<ReadingProgress | null> {
    const rows = await this.repo.findByUser(userId);
    return rows[0] ?? null;
  }

  async getRecentlyRead(userId: string, limit = 5): Promise<ReadingProgress[]> {
    const rows = await this.repo.findByUser(userId);
    return rows.slice(0, limit);
  }
}

export function createLastReadTracker(repo: EngineReadingProgressRepository): LastReadTracker {
  return new LastReadTracker(repo);
}
