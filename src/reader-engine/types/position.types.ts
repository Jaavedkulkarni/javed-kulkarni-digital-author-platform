import type { ReaderLocation } from './common';

export interface ReadingPosition {
  bookId: string;
  userId: string;
  location: ReaderLocation;
  progressPercent: number;
  wordsRead: number;
  readingTimeSeconds: number;
  isCompleted: boolean;
  lastReadAt: string;
}

export interface PositionUpdateInput {
  userId: string;
  bookId: string;
  location: ReaderLocation;
  progressPercent: number;
  wordsRead?: number;
  readingTimeSeconds?: number;
  isCompleted?: boolean;
  deviceInfo?: Record<string, unknown>;
}

export interface ReadingProgressStats {
  progressPercent: number;
  wordsRemaining: number;
  estimatedMinutesLeft: number;
  totalWords: number;
  wordsRead: number;
}
