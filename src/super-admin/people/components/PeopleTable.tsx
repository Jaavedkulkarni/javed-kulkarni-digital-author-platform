import { memo, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  AlertCircle,
  Check,
  ChevronDown,
  Columns3,
  MoreHorizontal,
  Users,
} from 'lucide-react';
import { EmptyState } from '../../../components/shared/states/EmptyState';
import { TOOLBAR_CONTROL_CLASS } from '../../../components/shared/constants';
import { PEOPLE_PAGE_SIZE_OPTIONS } from '../constants/people.constants';
import type { BulkOperationType } from '../bulk-operations/bulk-operations.types';
import { BULK_OPERATION_LABELS } from '../bulk-operations/bulk-operations.types';
import type { PeopleRowAction, PeopleUser, PeopleUserStatus } from '../types/people.types';

const ROW_ACTION_LABELS: Record<PeopleRowAction, string> = {
  view: 'View',
  edit: 'Edit',
  suspend: 'Suspend',
  restore: 'Restore',
  delete: 'Delete',
  recover: 'Recover',
};

function getRowActions(user: PeopleUser): PeopleRowAction[] {
  if (user.status === 'deleted') {
    return ['view', 'recover'];
  }

  const actions: PeopleRowAction[] = ['view', 'edit'];
  if (user.status === 'suspended') {
    actions.push('restore');
  } else {
    actions.push('suspend');
  }
  actions.push('delete');
  return actions;
}

interface PeopleTableProps {
  users: PeopleUser[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onViewUser?: (user: PeopleUser) => void;
  onRowAction?: (action: PeopleRowAction, user: PeopleUser) => void;
  onSelectionChange?: (users: PeopleUser[]) => void;
  selectionResetKey?: number;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (value: RowSelectionState) => void;
  selectedCount?: number;
  allPagesSelected?: boolean;
  onSelectAllPages?: () => void;
  onSelectCurrentPage?: () => void;
  onInvertSelection?: () => void;
  onClearSelection?: () => void;
  onBulkOperation?: (operation: BulkOperationType) => void;
  onBulkSuspend?: () => void;
  onBulkRestore?: () => void;
  onBulkDelete?: () => void;
  onBulkRecover?: () => void;
  suspendableSelectedCount?: number;
  restorableSelectedCount?: number;
  deletableSelectedCount?: number;
  recoverableSelectedCount?: number;
}

const STATUS_STYLES: Record<PeopleUserStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  suspended: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  pending: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  deleted: 'bg-red-500/15 text-red-400 border-red-500/30',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <div className="h-4 w-4 shrink-0 rounded bg-navy-700" />
          <div className="h-10 w-10 shrink-0 rounded-full bg-navy-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-navy-700" />
            <div className="h-3 w-1/2 rounded bg-navy-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RowActionsMenu({
  user,
  onAction,
}: {
  user: PeopleUser;
  onAction?: (action: PeopleRowAction, user: PeopleUser) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${user.name}`}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-navy-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 min-w-[10rem] rounded-lg border border-navy-600 bg-navy-800 py-1 shadow-xl"
        >
          {getRowActions(user).map((action) => (
            <button
              key={action}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onAction?.(action, user);
              }}
              className={`flex w-full px-3 py-2 text-left text-sm transition-colors hover:bg-navy-700 ${
                action === 'delete' || action === 'recover'
                  ? action === 'delete'
                    ? 'text-red-400'
                    : 'text-emerald-300'
                  : 'text-gray-200'
              }`}
            >
              {ROW_ACTION_LABELS[action]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export const PeopleTable = memo(function PeopleTable({
  users,
  isLoading = false,
  isRefreshing = false,
  isError = false,
  errorMessage,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onViewUser,
  onRowAction,
  onSelectionChange,
  selectionResetKey = 0,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  selectedCount: selectedCountProp,
  allPagesSelected = false,
  onSelectAllPages,
  onSelectCurrentPage,
  onInvertSelection,
  onClearSelection,
  onBulkOperation,
  onBulkSuspend,
  onBulkRestore,
  onBulkDelete,
  onBulkRecover,
  suspendableSelectedCount = 0,
  restorableSelectedCount = 0,
  deletableSelectedCount = 0,
  recoverableSelectedCount = 0,
}: PeopleTableProps) {
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});
  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const setRowSelection = onRowSelectionChange ?? setInternalRowSelection;
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const columnMenuRef = useRef<HTMLDivElement>(null);
  const bulkMenuRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<PeopleUser>[]>(
    () => [
      {
        id: 'select',
        size: 48,
        enableSorting: false,
        enableResizing: false,
        header: ({ table }) => (
          <input
            type="checkbox"
            aria-label="Select all rows"
            checked={table.getIsAllPageRowsSelected()}
            ref={(input) => {
              if (input) input.indeterminate = table.getIsSomePageRowsSelected();
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-gold-500 focus:ring-gold-400/50"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label={`Select ${row.original.name}`}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 rounded border-navy-600 bg-navy-900 text-gold-500 focus:ring-gold-400/50"
          />
        ),
      },
      {
        id: 'avatar',
        accessorKey: 'name',
        size: 64,
        enableSorting: false,
        header: 'Avatar',
        cell: ({ row }) => (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-400 ring-1 ring-gold-500/30"
            aria-hidden="true"
          >
            {getInitials(row.original.name)}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        size: 180,
        enableSorting: false,
        header: 'Name',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onViewUser?.(row.original)}
            className="text-left text-sm font-medium text-white transition-colors hover:text-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'email',
        size: 220,
        enableSorting: false,
        header: 'Email',
        cell: ({ getValue }) => (
          <span className="block max-w-[220px] truncate text-sm text-gray-300">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: 'phone',
        size: 150,
        enableSorting: false,
        header: 'Phone',
        meta: { hideOnMobile: true },
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-400">{String(getValue() ?? '—')}</span>
        ),
      },
      {
        accessorKey: 'primaryRole',
        size: 140,
        enableSorting: false,
        header: 'Primary Role',
        cell: ({ getValue }) => (
          <span className="inline-flex rounded-full border border-navy-600 bg-navy-900/60 px-2.5 py-0.5 text-xs font-medium text-gray-200">
            {String(getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        size: 110,
        enableSorting: false,
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue() as PeopleUserStatus;
          return (
            <span
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'emailVerified',
        size: 120,
        enableSorting: false,
        header: 'Email Verified',
        meta: { hideOnMobile: true },
        cell: ({ getValue }) => (
          <span className={`text-sm ${getValue() ? 'text-emerald-400' : 'text-gray-500'}`}>
            {getValue() ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        accessorKey: 'lastLogin',
        size: 160,
        enableSorting: false,
        header: 'Last Login',
        meta: { hideOnMobile: true },
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-400">{formatDateTime(getValue() as string | null)}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        size: 120,
        enableSorting: false,
        header: 'Created',
        meta: { hideOnMobile: true },
        cell: ({ getValue }) => (
          <span className="text-sm text-gray-400">{formatDate(getValue() as string)}</span>
        ),
      },
      {
        id: 'actions',
        size: 72,
        enableSorting: false,
        enableResizing: false,
        header: 'Actions',
        cell: ({ row }) => <RowActionsMenu user={row.original} onAction={onRowAction} />,
      },
    ],
    [onRowAction, onViewUser],
  );

  const table = useReactTable({
    data: users,
    columns,
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      columnVisibility,
      pagination: { pageIndex: page - 1, pageSize },
    },
    pageCount: totalPages,
    manualPagination: true,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(next);
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  });

  useEffect(() => {
    setRowSelection({});
  }, [selectionResetKey, setRowSelection]);

  useEffect(() => {
    if (!onSelectionChange) return;
    const selected = table.getSelectedRowModel().rows.map((row) => row.original);
    onSelectionChange(selected);
  }, [onSelectionChange, rowSelection, table]);

  useEffect(() => {
    if (!showColumnMenu && !showBulkMenu) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setShowColumnMenu(false);
      }
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(event.target as Node)) {
        setShowBulkMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBulkMenu, showColumnMenu]);

  const toggleableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.id !== 'select' && column.id !== 'actions');

  const showEmpty = !isLoading && !isError && users.length === 0;
  const pageSelectedCount = Object.keys(rowSelection).filter((id) => rowSelection[id]).length;
  const selectedCount = selectedCountProp ?? (allPagesSelected ? total : pageSelectedCount);
  const canPrevious = page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  const bulkOperations: BulkOperationType[] = [
    'bulk_edit',
    'suspend',
    'restore',
    'delete',
    'recover',
    'assign_role',
    'remove_role',
    'force_password_reset',
    'send_verification',
    'send_invite',
  ];

  return (
    <section
      aria-label="People table"
      className="overflow-hidden rounded-xl border border-navy-700 bg-navy-800/50"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-700 px-4 py-3">
        <div className="text-sm text-gray-400">
          {isLoading ? (
            'Loading users...'
          ) : (
            <>
              <span className="font-medium text-white">{total.toLocaleString()}</span> users
              {selectedCount > 0 || allPagesSelected ? (
                <span className="ml-2 text-gold-400">
                  · {allPagesSelected ? `All ${total.toLocaleString()} selected` : `${selectedCount} selected`}
                </span>
              ) : null}
              {isRefreshing ? <span className="ml-2 text-gray-500">Refreshing…</span> : null}
            </>
          )}
        </div>

        {selectedCount > 0 || allPagesSelected ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative" ref={bulkMenuRef}>
              <button
                type="button"
                onClick={() => setShowBulkMenu((value) => !value)}
                className={`${TOOLBAR_CONTROL_CLASS} gap-2 border-gold-500/40 bg-gold-500/10 px-3 text-gold-300 hover:bg-gold-500/20`}
              >
                Bulk Actions
                <ChevronDown className="h-4 w-4" />
              </button>
              {showBulkMenu ? (
                <div className="absolute left-0 z-20 mt-1 max-h-64 min-w-[14rem] overflow-y-auto rounded-lg border border-navy-600 bg-navy-800 py-1 shadow-xl">
                  {bulkOperations.map((operation) => (
                    <button
                      key={operation}
                      type="button"
                      onClick={() => {
                        setShowBulkMenu(false);
                        onBulkOperation?.(operation);
                      }}
                      className="flex w-full px-3 py-2 text-left text-sm text-gray-200 hover:bg-navy-700"
                    >
                      {BULK_OPERATION_LABELS[operation]}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {onSelectCurrentPage ? (
              <button type="button" onClick={onSelectCurrentPage} className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 px-3 text-xs`}>
                Current Page
              </button>
            ) : null}
            {onSelectAllPages ? (
              <button type="button" onClick={onSelectAllPages} className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 px-3 text-xs`}>
                All Pages
              </button>
            ) : null}
            {onInvertSelection ? (
              <button type="button" onClick={onInvertSelection} className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 px-3 text-xs`}>
                Invert
              </button>
            ) : null}
            {onClearSelection ? (
              <button type="button" onClick={onClearSelection} className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 px-3 text-xs`}>
                Clear
              </button>
            ) : null}
          </div>
        ) : null}

        {(selectedCount > 0 || allPagesSelected) && onBulkSuspend ? (
          <div className="flex flex-wrap items-center gap-2">
            {suspendableSelectedCount > 0 ? (
              <button
                type="button"
                onClick={onBulkSuspend}
                className={`${TOOLBAR_CONTROL_CLASS} border-amber-500/40 bg-amber-500/10 px-3 text-amber-300 hover:bg-amber-500/20`}
              >
                Bulk Suspend ({suspendableSelectedCount})
              </button>
            ) : null}
            {restorableSelectedCount > 0 ? (
              <button
                type="button"
                onClick={onBulkRestore}
                className={`${TOOLBAR_CONTROL_CLASS} border-emerald-500/40 bg-emerald-500/10 px-3 text-emerald-300 hover:bg-emerald-500/20`}
              >
                Bulk Restore ({restorableSelectedCount})
              </button>
            ) : null}
            {deletableSelectedCount > 0 ? (
              <button
                type="button"
                onClick={onBulkDelete}
                className={`${TOOLBAR_CONTROL_CLASS} border-red-500/40 bg-red-500/10 px-3 text-red-300 hover:bg-red-500/20`}
              >
                Bulk Delete ({deletableSelectedCount})
              </button>
            ) : null}
            {recoverableSelectedCount > 0 ? (
              <button
                type="button"
                onClick={onBulkRecover}
                className={`${TOOLBAR_CONTROL_CLASS} border-emerald-500/40 bg-emerald-500/10 px-3 text-emerald-300 hover:bg-emerald-500/20`}
              >
                Bulk Recover ({recoverableSelectedCount})
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="relative" ref={columnMenuRef}>
          <button
            type="button"
            aria-expanded={showColumnMenu}
            onClick={() => setShowColumnMenu((value) => !value)}
            className={`${TOOLBAR_CONTROL_CLASS} gap-2 border-navy-600 bg-navy-900/60 px-3 hover:bg-navy-700`}
          >
            <Columns3 className="h-4 w-4" aria-hidden="true" />
            Columns
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          {showColumnMenu ? (
            <div className="absolute right-0 z-20 mt-1 min-w-[12rem] rounded-lg border border-navy-600 bg-navy-800 py-1 shadow-xl">
              {toggleableColumns.map((column) => (
                <button
                  key={column.id}
                  type="button"
                  onClick={() => column.toggleVisibility()}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-200 hover:bg-navy-700"
                >
                  <span className="flex h-4 w-4 items-center justify-center">
                    {column.getIsVisible() ? <Check className="h-3.5 w-3.5 text-gold-400" /> : null}
                  </span>
                  {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <AlertCircle className="h-10 w-10 text-red-400" aria-hidden="true" />
          <p className="text-sm text-red-300">{errorMessage ?? 'Unable to load people data.'}</p>
        </div>
      ) : showEmpty ? (
        <EmptyState
          icon={Users as ComponentType<{ className?: string; 'aria-hidden'?: boolean }>}
          title="No people found"
          description="Try adjusting your search or filters. New users will appear here once added."
          ariaLabel="No people found"
          shellClassName="border-0 bg-transparent shadow-none"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-navy-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-navy-700">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className={`relative px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 ${
                        (header.column.columnDef.meta as { hideOnMobile?: boolean } | undefined)
                          ?.hideOnMobile
                          ? 'hidden lg:table-cell'
                          : ''
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanResize() ? (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none bg-transparent hover:bg-gold-400/40 ${
                            header.column.getIsResizing() ? 'bg-gold-400/60' : ''
                          }`}
                          aria-hidden="true"
                        />
                      ) : null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-navy-700/80 transition-colors hover:bg-navy-700/30 ${
                    row.getIsSelected() ? 'bg-gold-500/5' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className={`px-4 py-3 align-middle ${
                        (cell.column.columnDef.meta as { hideOnMobile?: boolean } | undefined)
                          ?.hideOnMobile
                          ? 'hidden lg:table-cell'
                          : ''
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && !showEmpty ? (
        <div className="flex flex-col gap-3 border-t border-navy-700 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <label htmlFor="people-page-size" className="sr-only">
              Rows per page
            </label>
            <select
              id="people-page-size"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="rounded-lg border border-navy-600 bg-navy-900/60 px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
            >
              {PEOPLE_PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
            <span>
              Page {page} of {Math.max(totalPages, 1)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={!canPrevious}
              className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 bg-navy-900/60 px-3 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={!canNext}
              className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 bg-navy-900/60 px-3 hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
});

export default PeopleTable;
