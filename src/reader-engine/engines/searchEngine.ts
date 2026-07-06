import type { ChapterContent } from '../types/bookLoader.types';
import type { SearchInsideBookInput, SearchInsideBookResult, SearchMatch } from '../types/search.types';
import { MAX_SEARCH_RESULTS } from '../constants/readerEngine.constants';

export class SearchEngine {
  searchInChapters(input: SearchInsideBookInput, chapters: ChapterContent[]): SearchInsideBookResult {
    const query = input.query.trim().toLowerCase();
    if (!query) return { query: input.query, matches: [], totalMatches: 0 };

    const maxResults = input.maxResults ?? MAX_SEARCH_RESULTS;
    const matches: SearchMatch[] = [];
    const chapterFilter = input.chapterIds ? new Set(input.chapterIds) : null;

    for (const chapter of chapters) {
      if (chapterFilter && !chapterFilter.has(chapter.chapterId)) continue;
      const content = chapter.content ?? '';
      const lower = content.toLowerCase();
      let startIndex = 0;

      while (matches.length < maxResults) {
        const index = lower.indexOf(query, startIndex);
        if (index === -1) break;

        const excerptStart = Math.max(0, index - 40);
        const excerptEnd = Math.min(content.length, index + query.length + 40);
        matches.push({
          chapterId: chapter.chapterId,
          chapterTitle: chapter.title,
          excerpt: content.slice(excerptStart, excerptEnd).trim(),
          matchIndex: index,
          cfi: null,
        });
        startIndex = index + query.length;
      }
    }

    return { query: input.query, matches, totalMatches: matches.length };
  }

  jumpToChapter(chapters: ChapterContent[], chapterId: string): number {
    return chapters.findIndex((ch) => ch.chapterId === chapterId);
  }
}

export function createSearchEngine(): SearchEngine {
  return new SearchEngine();
}
