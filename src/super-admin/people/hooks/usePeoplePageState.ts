import { useCallback, useState } from 'react';
import type { PeopleDrawerTab, PeopleSortField, PeopleUser } from '../types/people.types';
import { createEmptyPeopleFilters, type PeopleFiltersInput } from '../schemas/people.schemas';
import { PEOPLE_DEFAULT_PAGE_SIZE, PEOPLE_DEFAULT_SORT } from '../constants/people.constants';

export function usePeoplePageState() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [draftFilters, setDraftFilters] = useState<PeopleFiltersInput>(createEmptyPeopleFilters());
  const [appliedFilters, setAppliedFilters] = useState<PeopleFiltersInput>(createEmptyPeopleFilters());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PEOPLE_DEFAULT_PAGE_SIZE);
  const [sort, setSort] = useState<PeopleSortField>(PEOPLE_DEFAULT_SORT);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PeopleUser | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<PeopleDrawerTab>('general');
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');

  const toggleFilters = useCallback(() => {
    setIsFiltersOpen((open) => !open);
  }, []);

  const openDrawer = useCallback(
    (user: PeopleUser, tab: PeopleDrawerTab = 'general', mode: 'view' | 'edit' = 'view') => {
      setSelectedUser(user);
      setActiveDrawerTab(tab);
      setDrawerMode(mode);
      setDrawerOpen(true);
    },
    [],
  );

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setDrawerMode('view');
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...draftFilters });
    setSearchQuery(draftFilters.search);
    setPage(1);
  }, [draftFilters]);

  const clearFilters = useCallback(() => {
    const empty = createEmptyPeopleFilters();
    setDraftFilters(empty);
    setAppliedFilters(empty);
    setSearchQuery('');
    setPage(1);
  }, []);

  const updateDraftFilter = useCallback(
    <K extends keyof PeopleFiltersInput>(key: K, value: PeopleFiltersInput[K]) => {
      setDraftFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handlePageSizeChange = useCallback((nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((nextSort: PeopleSortField) => {
    setSort(nextSort);
    setPage(1);
  }, []);

  return {
    isFiltersOpen,
    searchQuery,
    setSearchQuery: handleSearchChange,
    draftFilters,
    appliedFilters,
    page,
    pageSize,
    sort,
    drawerOpen,
    selectedUser,
    activeDrawerTab,
    drawerMode,
    setActiveDrawerTab,
    toggleFilters,
    openDrawer,
    closeDrawer,
    applyFilters,
    clearFilters,
    updateDraftFilter,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
  };
}

export type UsePeoplePageStateReturn = ReturnType<typeof usePeoplePageState>;
