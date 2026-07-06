import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  calculateLibraryStats,
  DEFAULT_LIBRARY_FILTERS,
  getLibraryFilterOptions,
  hasActiveLibraryFilters,
  processLibraryBooks,
  type LibraryFilters,
  type LibrarySortKey,
  type LibraryViewMode,
} from '../../lib/libraryBookLogic';
import { readerQueryKeys } from '../query/queryKeys';
import { fetchLibraryBooks } from '../services/library.service';
import { syncMockLibraryBooks } from '../utils/mockSync';
import { EMPTY_LIBRARY_BOOKS } from '../utils/queryDefaults';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';

export function useLibraryBooks() {
  const userId = useReaderUserId();
  const isOnline = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<LibraryFilters>(DEFAULT_LIBRARY_FILTERS);
  const [sortKey, setSortKey] = useState<LibrarySortKey>('recently-added');
  const [viewMode, setViewMode] = useState<LibraryViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: readerQueryKeys.library(userId ?? 'guest'),
    queryFn: () => fetchLibraryBooks(userId!),
    enabled: Boolean(userId) && isOnline,
  });

  const sourceBooks = query.data ?? EMPTY_LIBRARY_BOOKS;

  useEffect(() => {
    syncMockLibraryBooks(sourceBooks);
  }, [sourceBooks]);

  const datasetEmpty = !query.isLoading && sourceBooks.length === 0;

  const filterOptions = useMemo(() => getLibraryFilterOptions(sourceBooks), [sourceBooks]);

  const books = useMemo(
    () => processLibraryBooks(sourceBooks, searchQuery, filters, sortKey),
    [sourceBooks, searchQuery, filters, sortKey]
  );

  const stats = useMemo(() => calculateLibraryStats(sourceBooks), [sourceBooks]);

  const filtersActive = useMemo(
    () => hasActiveLibraryFilters(filters, searchQuery),
    [filters, searchQuery]
  );

  const updateFilter = useCallback(<K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_LIBRARY_FILTERS);
  }, []);

  const selectBook = useCallback((bookId: string) => {
    setSelectedBookId(bookId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedBookId(null);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    resetFilters,
    filterOptions,
    sortKey,
    setSortKey,
    viewMode,
    setViewMode,
    filterOpen,
    setFilterOpen,
    books,
    stats,
    datasetEmpty,
    filtersActive,
    selectedBookId,
    selectBook,
    clearSelection,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}

export default useLibraryBooks;
