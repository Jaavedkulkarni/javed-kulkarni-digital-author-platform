const MAX_CACHED_CHAPTERS = 10;

export class ChapterMemoryCache {
  private cache = new Map<string, string>();
  private accessOrder: string[] = [];

  get(key: string): string | undefined {
    const value = this.cache.get(key);
    if (value) {
      this.accessOrder = this.accessOrder.filter((k) => k !== key);
      this.accessOrder.push(key);
    }
    return value;
  }

  set(key: string, content: string): void {
    if (this.cache.size >= MAX_CACHED_CHAPTERS && !this.cache.has(key)) {
      const oldest = this.accessOrder.shift();
      if (oldest) this.cache.delete(oldest);
    }
    this.cache.set(key, content);
    this.accessOrder = this.accessOrder.filter((k) => k !== key);
    this.accessOrder.push(key);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  size(): number {
    return this.cache.size;
  }
}

export function shouldLazyLoadChapter(
  chapterIndex: number,
  currentIndex: number,
  buffer: number
): boolean {
  return Math.abs(chapterIndex - currentIndex) <= buffer;
}
