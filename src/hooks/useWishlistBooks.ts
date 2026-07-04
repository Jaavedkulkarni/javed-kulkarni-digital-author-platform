import { useCallback, useMemo, useState } from 'react';
import { MOCK_WISHLIST_BOOKS } from '../data/mockWishlistBooks';
import {
  calculateWishlistStats,
  DEFAULT_WISHLIST_FILTERS,
  getWishlistFilterOptions,
  hasActiveWishlistFilters,
  processWishlistBooks,
  type WishlistFilters,
  type WishlistSortKey,
  type WishlistViewMode,
} from '../lib/wishlistBookLogic';

export function useWishlistBooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<WishlistFilters>(DEFAULT_WISHLIST_FILTERS);
  const [sortKey, setSortKey] = useState<WishlistSortKey>('recently-added');
  const [viewMode, setViewMode] = useState<WishlistViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);

  const datasetEmpty = MOCK_WISHLIST_BOOKS.length === 0;

  const filterOptions = useMemo(() => getWishlistFilterOptions(MOCK_WISHLIST_BOOKS), []);

  const books = useMemo(
    () => processWishlistBooks(MOCK_WISHLIST_BOOKS, searchQuery, filters, sortKey),
    [searchQuery, filters, sortKey]
  );

  const stats = useMemo(() => calculateWishlistStats(MOCK_WISHLIST_BOOKS), []);

  const filtersActive = useMemo(
    () => hasActiveWishlistFilters(filters, searchQuery),
    [filters, searchQuery]
  );

  const updateFilter = useCallback(<K extends keyof WishlistFilters>(key: K, value: WishlistFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_WISHLIST_FILTERS);
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
  };
}

export default useWishlistBooks;
