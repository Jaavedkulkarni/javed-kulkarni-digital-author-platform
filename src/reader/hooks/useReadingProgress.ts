import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  calculateReadingStats,
  DEFAULT_READING_FILTERS,
  getReadingFilterOptions,
  hasActiveReadingFilters,
  processReadingRecords,
  toReadingCardItem,
  type ReadingFilters,
  type ReadingSortKey,
  type ReadingViewMode,
} from '../../lib/readingProgressLogic';
import { readerQueryKeys } from '../query/queryKeys';
import { fetchReadingProgress } from '../services/readingProgress.service';
import { syncMockReadingProgress } from '../utils/mockSync';
import { EMPTY_READING_RECORDS } from '../utils/queryDefaults';
import { useReaderUserId } from './useReaderUserId';
import { useOnlineStatus } from '../utils/offline';

export function useReadingProgress() {
  const userId = useReaderUserId();
  const isOnline = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ReadingFilters>(DEFAULT_READING_FILTERS);
  const [sortKey, setSortKey] = useState<ReadingSortKey>('recently-read');
  const [viewMode, setViewMode] = useState<ReadingViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: readerQueryKeys.readingProgress(userId ?? 'guest'),
    queryFn: () => fetchReadingProgress(userId!),
    enabled: Boolean(userId) && isOnline,
  });

  const sourceRecords = query.data ?? EMPTY_READING_RECORDS;

  useEffect(() => {
    syncMockReadingProgress(sourceRecords);
  }, [sourceRecords]);

  const datasetEmpty = !query.isLoading && sourceRecords.length === 0;

  const filterOptions = useMemo(() => getReadingFilterOptions(sourceRecords), [sourceRecords]);

  const processedRecords = useMemo(
    () => processReadingRecords(sourceRecords, searchQuery, filters, sortKey),
    [sourceRecords, searchQuery, filters, sortKey]
  );

  const items = useMemo(
    () => processedRecords.map((record) => toReadingCardItem(record)),
    [processedRecords]
  );

  const stats = useMemo(() => calculateReadingStats(sourceRecords), [sourceRecords]);

  const filtersActive = useMemo(
    () => hasActiveReadingFilters(filters, searchQuery),
    [filters, searchQuery]
  );

  const updateFilter = useCallback(<K extends keyof ReadingFilters>(key: K, value: ReadingFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_READING_FILTERS);
  }, []);

  const selectRecord = useCallback((recordId: string) => {
    setSelectedRecordId(recordId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRecordId(null);
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
    items,
    processedRecordIds: processedRecords.map((record) => record.id),
    stats,
    datasetEmpty,
    filtersActive,
    selectedRecordId,
    selectRecord,
    clearSelection,
    resultCount: items.length,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
    records: sourceRecords,
  };
}

export default useReadingProgress;
