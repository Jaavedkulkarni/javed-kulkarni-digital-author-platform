import { useCallback, useMemo, useState } from 'react';
import { MOCK_READING_PROGRESS } from '../data/mockReadingProgress';
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
} from '../lib/readingProgressLogic';

export function useReadingProgress() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ReadingFilters>(DEFAULT_READING_FILTERS);
  const [sortKey, setSortKey] = useState<ReadingSortKey>('recently-read');
  const [viewMode, setViewMode] = useState<ReadingViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const datasetEmpty = MOCK_READING_PROGRESS.length === 0;

  const filterOptions = useMemo(() => getReadingFilterOptions(MOCK_READING_PROGRESS), []);

  const processedRecords = useMemo(
    () => processReadingRecords(MOCK_READING_PROGRESS, searchQuery, filters, sortKey),
    [searchQuery, filters, sortKey]
  );

  const items = useMemo(
    () => processedRecords.map((record) => toReadingCardItem(record)),
    [processedRecords]
  );

  const stats = useMemo(() => calculateReadingStats(MOCK_READING_PROGRESS), []);

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
  };
}

export default useReadingProgress;
