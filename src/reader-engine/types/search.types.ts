export interface SearchMatch {
  chapterId: string | null;
  chapterTitle: string;
  excerpt: string;
  matchIndex: number;
  pageNumber?: number | null;
  cfi?: string | null;
}

export interface SearchInsideBookInput {
  bookId: string;
  query: string;
  chapterIds?: string[];
  maxResults?: number;
}

export interface SearchInsideBookResult {
  query: string;
  matches: SearchMatch[];
  totalMatches: number;
}

export interface TocEntry {
  id: string;
  title: string;
  chapterNumber: number;
  level: number;
  children: TocEntry[];
}
