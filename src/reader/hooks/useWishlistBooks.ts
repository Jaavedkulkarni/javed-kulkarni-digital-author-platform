import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  calculateWishlistStats,
  DEFAULT_WISHLIST_FILTERS,
  getWishlistFilterOptions,
  hasActiveWishlistFilters,
  processWishlistBooks,
  type WishlistFilters,
  type WishlistSortKey,
  type WishlistViewMode,
} from '../../lib/wishlistBookLogic';
import { readerQueryKeys } from '../query/queryKeys';
import { fetchWishlistBooks, removeBookFromWishlist } from '../services/wishlist.service';
import { syncMockWishlistBooks } from '../utils/mockSync';
import { EMPTY_WISHLIST_BOOKS } from '../utils/queryDefaults';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';

export function useWishlistBooks() {
  const userId = useReaderUserId();
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<WishlistFilters>(DEFAULT_WISHLIST_FILTERS);
  const [sortKey, setSortKey] = useState<WishlistSortKey>('recently-added');
  const [viewMode, setViewMode] = useState<WishlistViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);

  const query = useQuery({
    queryKey: readerQueryKeys.wishlist(userId ?? 'guest'),
    queryFn: () => fetchWishlistBooks(userId!),
    enabled: Boolean(userId) && isOnline,
  });

  const removeMutation = useMutation({
    mutationFn: (wishlistItemId: string) => removeBookFromWishlist(wishlistItemId),
    onMutate: async (wishlistItemId) => {
      await queryClient.cancelQueries({ queryKey: readerQueryKeys.wishlist(userId!) });
      const previous = queryClient.getQueryData<Awaited<ReturnType<typeof fetchWishlistBooks>>>(
        readerQueryKeys.wishlist(userId!)
      );
      queryClient.setQueryData(
        readerQueryKeys.wishlist(userId!),
        (previous ?? []).filter((book) => book.id !== wishlistItemId)
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(readerQueryKeys.wishlist(userId!), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: readerQueryKeys.wishlist(userId!) });
    },
  });

  const sourceBooks = query.data ?? EMPTY_WISHLIST_BOOKS;

  useEffect(() => {
    syncMockWishlistBooks(sourceBooks);
  }, [sourceBooks]);

  const datasetEmpty = !query.isLoading && sourceBooks.length === 0;

  const filterOptions = useMemo(() => getWishlistFilterOptions(sourceBooks), [sourceBooks]);

  const books = useMemo(
    () => processWishlistBooks(sourceBooks, searchQuery, filters, sortKey),
    [sourceBooks, searchQuery, filters, sortKey]
  );

  const stats = useMemo(() => calculateWishlistStats(sourceBooks), [sourceBooks]);

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
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
    removeFromWishlist: removeMutation.mutate,
  };
}

export default useWishlistBooks;
