import type { ChapterContent } from '../types/bookLoader.types';
import type { ReaderLocation } from '../types/common';
import type { TocEntry } from '../types/search.types';
import { ChapterMemoryCache, shouldLazyLoadChapter } from '../utils/memory';
import { LAZY_CHAPTER_BATCH_SIZE, VIRTUAL_RENDER_BUFFER_CHAPTERS } from '../constants/readerEngine.constants';

export interface EpubRenderState {
  bookId: string;
  currentChapterIndex: number;
  loadedChapters: Map<number, ChapterContent>;
  toc: TocEntry[];
  spine: string[];
}

export class EpubEngine {
  private memoryCache = new ChapterMemoryCache();

  buildToc(chapters: ChapterContent[]): TocEntry[] {
    return chapters.map((ch) => ({
      id: ch.chapterId,
      title: ch.title,
      chapterNumber: ch.chapterNumber,
      level: 1,
      children: [],
    }));
  }

  buildSpine(chapters: ChapterContent[]): string[] {
    return chapters.map((ch) => ch.chapterId);
  }

  createRenderState(bookId: string, chapters: ChapterContent[]): EpubRenderState {
    return {
      bookId,
      currentChapterIndex: 0,
      loadedChapters: new Map(),
      toc: this.buildToc(chapters),
      spine: this.buildSpine(chapters),
    };
  }

  getChaptersToLoad(currentIndex: number, totalChapters: number): number[] {
    const indices: number[] = [];
    const start = Math.max(0, currentIndex - VIRTUAL_RENDER_BUFFER_CHAPTERS);
    const end = Math.min(totalChapters - 1, currentIndex + VIRTUAL_RENDER_BUFFER_CHAPTERS);
    for (let i = start; i <= end; i++) {
      if (shouldLazyLoadChapter(i, currentIndex, VIRTUAL_RENDER_BUFFER_CHAPTERS)) {
        indices.push(i);
      }
    }
    return indices;
  }

  getLazyBatchStart(currentIndex: number): number {
    return Math.floor(currentIndex / LAZY_CHAPTER_BATCH_SIZE) * LAZY_CHAPTER_BATCH_SIZE;
  }

  resolveLocationFromCfi(cfi: string, chapters: ChapterContent[]): ReaderLocation {
    const chapter = chapters[0];
    return {
      cfi,
      chapterId: chapter?.chapterId ?? null,
      chapterNumber: chapter?.chapterNumber ?? null,
    };
  }

  cacheChapterContent(chapterId: string, content: string): void {
    this.memoryCache.set(chapterId, content);
  }

  getCachedChapter(chapterId: string): string | undefined {
    return this.memoryCache.get(chapterId);
  }

  clearCache(): void {
    this.memoryCache.clear();
  }
}

export function createEpubEngine(): EpubEngine {
  return new EpubEngine();
}
