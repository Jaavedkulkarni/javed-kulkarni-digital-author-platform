import { useMemo, useState } from 'react';

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

import { usePeopleSuspendRestore } from '../suspend-restore';

import { usePeopleDeleteRecover } from '../delete-recover';

import { BulkOperationDialog, usePeopleBulkOperations } from '../bulk-operations';

import type { BulkOperationType } from '../bulk-operations/bulk-operations.types';

import {

  ExportUsersDialog,

  ImportUsersDialog,

  usePeopleExport,

  usePeopleImport,

} from '../import-export';

import {

  useInvalidatePeople,

  usePeople,

  usePeopleFilters,

  usePeoplePageState,

  usePeopleSelection,

  usePeopleStats,

} from '../hooks';

import { serializePeopleQueryKey } from '../queries/people.queries';

import { getPeopleService } from '../services/people.service';

import type { PeopleRowAction, PeopleUser } from '../types/people.types';



function buildUserStub(id: string): PeopleUser {

  return {

    id,

    avatarUrl: null,

    name: id.slice(0, 8),

    email: '',

    phone: null,

    primaryRole: '',

    primaryRoleSlug: '',

    status: 'active',

    emailVerified: false,

    lastLogin: null,

    createdAt: new Date().toISOString(),

    country: null,

    timezone: null,

  };

}



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



  const exportQueryInput = useMemo(

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

        page: 1,

        pageSize: 5000,

      }),

    [appliedFilters, searchQuery, sort],

  );



  const peopleQuery = usePeople(queryInput);

  const statsQuery = usePeopleStats();

  const filtersQuery = usePeopleFilters();

  const { invalidateEverything } = useInvalidatePeople();

  const listData = peopleQuery.data;

  const selection = usePeopleSelection(listData?.total ?? 0, listData?.items ?? []);



  const onBulkComplete = () => {

    selection.bumpResetKey();

    void invalidateEverything();

  };



  const suspendRestore = usePeopleSuspendRestore(onBulkComplete);

  const deleteRecover = usePeopleDeleteRecover(onBulkComplete);

  const bulkOperations = usePeopleBulkOperations(onBulkComplete);

  const peopleImport = usePeopleImport(onBulkComplete);

  const peopleExport = usePeopleExport();



  const { open: createUserOpen, openDrawer: openCreateUser, closeDrawer: closeCreateUser } =

    useCreateUserDrawer();

  const createRoleOptions = useMemo(

    () => (filtersQuery.data?.roles ?? []).filter((role) => role.value !== ''),

    [filtersQuery.data?.roles],

  );



  const [visibleColumns] = useState<string[]>([

    'name',

    'email',

    'primaryRole',

    'status',

    'lastLogin',

    'createdAt',

  ]);



  const resolveBulkTargets = async (): Promise<PeopleUser[]> => {

    if (selection.allPagesSelected) {

      const result = await getPeopleService().getAllMatchingIds(exportQueryInput);

      if (!result.success || !result.data) return [];

      return result.data.map(buildUserStub);

    }

    return selection.selectedUsers;

  };



  const handleBulkOperation = async (operation: BulkOperationType) => {

    const targets = await resolveBulkTargets();

    if (targets.length === 0) return;

    bulkOperations.openOperation(operation, targets);

  };



  const handleRefresh = () => {

    void invalidateEverything();

  };



  const handleRowAction = (action: PeopleRowAction, user: PeopleUser) => {

    if (action === 'view') {

      openDrawer(user, 'general', 'view');

      return;

    }

    if (action === 'edit') {

      openDrawer(user, 'general', 'edit');

      return;

    }

    if (action === 'suspend') {

      suspendRestore.openSuspend([user]);

      return;

    }

    if (action === 'restore') {

      suspendRestore.openRestore([user]);

      return;

    }

    if (action === 'delete') {

      deleteRecover.openDelete([user]);

      return;

    }

    if (action === 'recover') {

      deleteRecover.openRecover([user]);

    }

  };



  const handleBulkSuspend = async () => {

    const targets = (await resolveBulkTargets()).filter(

      (user) => user.status !== 'suspended' && user.status !== 'deleted',

    );

    if (targets.length === 0) return;

    bulkOperations.openOperation('suspend', targets);

  };



  const handleBulkRestore = async () => {

    const targets = (await resolveBulkTargets()).filter((user) => user.status === 'suspended');

    if (targets.length === 0) return;

    bulkOperations.openOperation('restore', targets);

  };



  const handleBulkDelete = async () => {

    const targets = (await resolveBulkTargets()).filter((user) => user.status !== 'deleted');

    if (targets.length === 0) return;

    bulkOperations.openOperation('delete', targets);

  };



  const handleBulkRecover = async () => {

    const targets = (await resolveBulkTargets()).filter((user) => user.status === 'deleted');

    if (targets.length === 0) return;

    bulkOperations.openOperation('recover', targets);

  };



  const suspendableSelectedCount = selection.selectedUsers.filter(

    (user) => user.status !== 'suspended' && user.status !== 'deleted',

  ).length;

  const restorableSelectedCount = selection.selectedUsers.filter((user) => user.status === 'suspended').length;

  const deletableSelectedCount = selection.selectedUsers.filter((user) => user.status !== 'deleted').length;

  const recoverableSelectedCount = selection.selectedUsers.filter((user) => user.status === 'deleted').length;

  const isRefreshing = peopleQuery.isFetching && !peopleQuery.isLoading;



  const exportFilters = useMemo(

    () => ({

      search: searchQuery,

      role: appliedFilters.role,

      status: appliedFilters.status,

      verification: appliedFilters.verification,

      country: appliedFilters.country,

      dateFrom: appliedFilters.dateFrom,

      dateTo: appliedFilters.dateTo,

    }),

    [appliedFilters, searchQuery],

  );



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

        onImport={peopleImport.openImport}

        onExport={peopleExport.openExport}

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

        onSelectionChange={(users) => {
          selection.syncPageSelection(users, listData?.items ?? []);
        }}

        selectionResetKey={selection.resetKey}

        rowSelection={selection.rowSelection}

        onRowSelectionChange={selection.setRowSelection}

        selectedCount={selection.selectedCount}

        allPagesSelected={selection.allPagesSelected}

        onSelectCurrentPage={() => selection.selectPage(listData?.items ?? [])}

        onSelectAllPages={selection.selectAllPages}

        onInvertSelection={() => selection.invertPageSelection(listData?.items ?? [])}

        onClearSelection={selection.clearSelection}

        onBulkOperation={(operation) => void handleBulkOperation(operation)}

        onBulkSuspend={() => void handleBulkSuspend()}

        onBulkRestore={() => void handleBulkRestore()}

        onBulkDelete={() => void handleBulkDelete()}

        onBulkRecover={() => void handleBulkRecover()}

        suspendableSelectedCount={suspendableSelectedCount}

        restorableSelectedCount={restorableSelectedCount}

        deletableSelectedCount={deletableSelectedCount}

        recoverableSelectedCount={recoverableSelectedCount}

      />



      <PeopleDrawer

        user={selectedUser}

        open={drawerOpen}

        mode={drawerMode}

        activeTab={activeDrawerTab}

        onTabChange={setActiveDrawerTab}

        onClose={closeDrawer}

        roleOptions={createRoleOptions}

        rolesLoading={filtersQuery.isLoading}

      />



      <CreateUserDrawer

        open={createUserOpen}

        onClose={closeCreateUser}

        roleOptions={createRoleOptions}

        rolesLoading={filtersQuery.isLoading}

      />



      <PeopleDialogs suspendRestore={suspendRestore} deleteRecover={deleteRecover} />



      <BulkOperationDialog controller={bulkOperations} roleOptions={createRoleOptions} />

      <ImportUsersDialog controller={peopleImport} />

      <ExportUsersDialog

        controller={peopleExport}

        selectedCount={selection.selectedCount}

        visibleColumns={visibleColumns}

        filters={exportFilters}

        selectedUserIds={selection.selectedUsers.map((user) => user.id)}

      />

    </div>

  );

}



export default PeoplePage;


