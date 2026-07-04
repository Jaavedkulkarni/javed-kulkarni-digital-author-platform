import { useCallback, useMemo, useState } from 'react';
import { MOCK_LIBRARY_BOOKS } from '../data/mockLibraryBooks';
import {
  calculateLibraryStats,
  DEFAULT_LIBRARY_FILTERS,
  getLibraryFilterOptions,
  hasActiveLibraryFilters,
  processLibraryBooks,
  type LibraryFilters,
  type LibrarySortKey,
  type LibraryViewMode,
} from '../lib/libraryBookLogic';

export function useLibraryBooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<LibraryFilters>(DEFAULT_LIBRARY_FILTERS);
  const [sortKey, setSortKey] = useState<LibrarySortKey>('recently-added');
  const [viewMode, setViewMode] = useState<LibraryViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const datasetEmpty = MOCK_LIBRARY_BOOKS.length === 0;

  const filterOptions = useMemo(() => getLibraryFilterOptions(MOCK_LIBRARY_BOOKS), []);

  const books = useMemo(
    () => processLibraryBooks(MOCK_LIBRARY_BOOKS, searchQuery, filters, sortKey),
    [searchQuery, filters, sortKey]
  );

  const stats = useMemo(() => calculateLibraryStats(MOCK_LIBRARY_BOOKS), []);

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
  };
}

export default useLibraryBooks;
