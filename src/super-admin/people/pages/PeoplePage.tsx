import { useMemo } from 'react';
import { PageHeader } from '../../../components/shared/page/PageHeader';
import { PEOPLE_PAGE_SUBTITLE, PEOPLE_PAGE_TITLE } from '../constants/people.constants';
import {
  PeopleBreadcrumb,
  PeopleDialogs,
  PeopleDrawer,
  PeopleFilters,
  PeopleStats,
  PeopleTable,
  PeopleToolbar,
} from '../components';
import { CreateUserDrawer, useCreateUserDrawer } from '../create-user';
import { useInvalidatePeople, usePeople, usePeopleFilters, usePeoplePageState, usePeopleStats } from '../hooks';
import { serializePeopleQueryKey } from '../queries/people.queries';
import type { PeopleRowAction, PeopleUser } from '../types/people.types';

export function PeoplePage() {
  const {
    isFiltersOpen,
    searchQuery,
    setSearchQuery,
    draftFilters,
    appliedFilters,
    page,
    pageSize,
    sort,
    drawerOpen,
    selectedUser,
    activeDrawerTab,
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
  } = usePeoplePageState();

  const queryInput = useMemo(
    () =>
      serializePeopleQueryKey({
        search: searchQuery,
        role: appliedFilters.role,
        status: appliedFilters.status,
        verification: appliedFilters.verification,
        country: appliedFilters.country,
        dateFrom: appliedFilters.dateFrom,
        dateTo: appliedFilters.dateTo,
        sort,
        page,
        pageSize,
      }),
    [appliedFilters, page, pageSize, searchQuery, sort],
  );

  const peopleQuery = usePeople(queryInput);
  const statsQuery = usePeopleStats();
  const filtersQuery = usePeopleFilters();
  const { invalidateEverything } = useInvalidatePeople();
  const { open: createUserOpen, openDrawer: openCreateUser, closeDrawer: closeCreateUser } =
    useCreateUserDrawer();

  const createRoleOptions = useMemo(
    () => (filtersQuery.data?.roles ?? []).filter((role) => role.value !== ''),
    [filtersQuery.data?.roles],
  );

  const handleRefresh = () => {
    void invalidateEverything();
  };

  const handleRowAction = (action: PeopleRowAction, user: PeopleUser) => {
    if (action === 'view' || action === 'edit') {
      openDrawer(user);
    }
  };

  const listData = peopleQuery.data;
  const isRefreshing = peopleQuery.isFetching && !peopleQuery.isLoading;

  return (
    <div className="space-y-6">
      <PeopleBreadcrumb />

      <PageHeader title={PEOPLE_PAGE_TITLE} subtitle={PEOPLE_PAGE_SUBTITLE} />

      <PeopleStats
        stats={statsQuery.data}
        isLoading={statsQuery.isLoading}
        isError={statsQuery.isError}
      />

      <PeopleToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sort={sort}
        onSortChange={handleSortChange}
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={toggleFilters}
        onRefresh={handleRefresh}
        onNewUser={openCreateUser}
        isRefreshing={isRefreshing || statsQuery.isFetching}
        disabled={peopleQuery.isLoading}
      />

      <PeopleFilters
        open={isFiltersOpen}
        filters={draftFilters}
        filterOptions={filtersQuery.data}
        optionsLoading={filtersQuery.isLoading}
        onChange={updateDraftFilter}
        onApply={applyFilters}
        onClear={clearFilters}
        disabled={peopleQuery.isLoading}
      />

      <PeopleTable
        users={listData?.items ?? []}
        isLoading={peopleQuery.isLoading}
        isRefreshing={isRefreshing}
        isError={peopleQuery.isError}
        errorMessage={peopleQuery.error?.message}
        page={listData?.page ?? page}
        pageSize={listData?.pageSize ?? pageSize}
        total={listData?.total ?? 0}
        totalPages={listData?.totalPages ?? 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onViewUser={openDrawer}
        onRowAction={handleRowAction}
      />

      <PeopleDrawer
        user={selectedUser}
        open={drawerOpen}
        activeTab={activeDrawerTab}
        onTabChange={setActiveDrawerTab}
        onClose={closeDrawer}
      />

      <CreateUserDrawer
        open={createUserOpen}
        onClose={closeCreateUser}
        roleOptions={createRoleOptions}
        rolesLoading={filtersQuery.isLoading}
      />

      <PeopleDialogs />
    </div>
  );
}

export default PeoplePage;
