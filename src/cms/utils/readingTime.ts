const WORDS_PER_MINUTE = 200;

export function calculateWordCount(content: string | null | undefined): number {
  if (!content) return 0;
  const words = content.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function calculateReadingTimeMinutes(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function aggregateWordCount(chapters: Array<{ word_count?: number | null; content?: string | null }>): number {
  return chapters.reduce((total, chapter) => {
    if (chapter.word_count) return total + chapter.word_count;
    return total + calculateWordCount(chapter.content);
  }, 0);
}
