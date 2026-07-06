import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReaderEngineServices } from './useReaderEngineServices';
import { readerEngineQueryKeys } from '../query/queryKeys';
import type { SearchInsideBookInput } from '../types/search.types';

export function useReaderSearch(bookId: string) {
  const { search, bookLoader } = useReaderEngineServices();
  const [query, setQuery] = useState('');

  const chaptersQuery = useQuery({
    queryKey: readerEngineQueryKeys.chapters(bookId),
    queryFn: () => bookLoader.loadChapters(bookId),
    enabled: Boolean(bookId),
    staleTime: 5 * 60 * 1000,
  });

  const results = useMemo(() => {
    if (!query.trim() || !chaptersQuery.data) return null;
    const input: SearchInsideBookInput = { bookId, query };
    return search.searchInChapters(input, chaptersQuery.data);
  }, [search, bookId, query, chaptersQuery.data]);

  const toc = useMemo(
    () =>
      chaptersQuery.data
        ? chaptersQuery.data.map((ch) => ({
            id: ch.chapterId,
            title: ch.title,
            chapterNumber: ch.chapterNumber,
            level: 1,
            children: [] as never[],
          }))
        : [],
    [chaptersQuery.data]
  );

  const jumpToChapter = useCallback(
    (chapterId: string) => {
      if (!chaptersQuery.data) return -1;
      return search.jumpToChapter(chaptersQuery.data, chapterId);
    },
    [search, chaptersQuery.data]
  );

  return {
    query,
    setQuery,
    results,
    toc,
    chapters: chaptersQuery.data ?? [],
    jumpToChapter,
    isLoading: chaptersQuery.isLoading,
  };
}
