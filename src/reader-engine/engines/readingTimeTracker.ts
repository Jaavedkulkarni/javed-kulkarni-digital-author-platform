import type { SessionTimeEntry } from '../types/statistics.types';

export class ReadingTimeTracker {
  private activeSessions = new Map<string, { startedAt: number; wordsAtStart: number }>();

  start(sessionId: string, wordsRead = 0): void {
    this.activeSessions.set(sessionId, { startedAt: Date.now(), wordsAtStart: wordsRead });
  }

  stop(sessionId: string, bookId: string, wordsRead: number): SessionTimeEntry | null {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    this.activeSessions.delete(sessionId);
    const endedAt = new Date().toISOString();
    const durationSeconds = Math.round((Date.now() - session.startedAt) / 1000);

    return {
      sessionId,
      bookId,
      startedAt: new Date(session.startedAt).toISOString(),
      endedAt,
      durationSeconds,
      wordsRead: Math.max(0, wordsRead - session.wordsAtStart),
    };
  }

  getElapsedSeconds(sessionId: string): number {
    const session = this.activeSessions.get(sessionId);
    if (!session) return 0;
    return Math.round((Date.now() - session.startedAt) / 1000);
  }
}

export function createReadingTimeTracker(): ReadingTimeTracker {
  return new ReadingTimeTracker();
}
