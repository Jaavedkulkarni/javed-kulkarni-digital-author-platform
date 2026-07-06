import { DEFAULT_WORDS_PER_MINUTE } from '../constants/readerEngine.constants';

export function estimateMinutesLeft(wordsRemaining: number, wpm = DEFAULT_WORDS_PER_MINUTE): number {
  if (wordsRemaining <= 0 || wpm <= 0) return 0;
  return Math.ceil(wordsRemaining / wpm);
}

export function formatReadingTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

export function calculateProgressPercent(wordsRead: number, totalWords: number): number {
  if (totalWords <= 0) return 0;
  return Math.min(100, Math.round((wordsRead / totalWords) * 100 * 100) / 100);
}

export function calculateWordsRemaining(wordsRead: number, totalWords: number): number {
  return Math.max(0, totalWords - wordsRead);
}
