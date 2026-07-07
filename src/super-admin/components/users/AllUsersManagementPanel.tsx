import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  Columns3,
  Download,
  FileText,
  Filter,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Shield,
  SlidersHorizontal,
  Upload,
  UserCheck,
  UserCog,
  Users,
  UserX,
} from 'lucide-react';
import { PageHeader } from '../../../components/shared/page/PageHeader';
import { SearchInput } from '../../../components/shared/search/SearchInput';
import { EmptyState } from '../../../components/shared/states/EmptyState';
import { PrimaryButton } from '../../../components/shared/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/shared/buttons/SecondaryButton';
import { StatusBadge } from '../../../components/shared/badges/StatusBadge';
import { RoleBadge } from '../../../roles/components/RoleBadge';
import {
  FILTER_INLINE_LABEL_CLASS,
  FILTER_INLINE_SELECT_CLASS,
  FILTER_LABEL_CLASS,
  FILTER_POPOVER_SELECT_CLASS,
  TOOLBAR_CONTROL_CLASS,
  TOOLBAR_SHELL_CLASS,
} from '../../../components/shared/constants';
import type {
  AdvancedSearchGroup,
  AllUsersColumnKey,
  AllUsersRecord,
  AllUsersUiPreviewState,
} from './allUsers.types';
import {
  computeSampleStats,
  PAGE_SIZE_OPTIONS,
  SAMPLE_USERS,
  SAVED_FILTER_PRESETS,
} from './allUsersSampleData';

interface AllUsersManagementPanelProps {
  previewState?: AllUsersUiPreviewState;
}

const COLUMN_DEFINITIONS: { key: AllUsersColumnKey; label: string; defaultVisible: boolean }[] = [
  { key: 'select', label: 'Select', defaultVisible: true },
  { key: 'avatar', label: 'Avatar', defaultVisible: true },
  { key: 'userId', label: 'User ID', defaultVisible: true },
  { key: 'name', label: 'Name', defaultVisible: true },
  { key: 'username', label: 'Username', defaultVisible: true },
  { key: 'email', label: 'Email', defaultVisible: true },
  { key: 'phone', label: 'Phone', defaultVisible: false },
  { key: 'roles', label: 'Roles', defaultVisible: true },
  { key: 'status', label: 'Status', defaultVisible: true },
  { key: 'membership', label: 'Membership', defaultVisible: true },
  { key: 'verification', label: 'Verification', defaultVisible: true },
  { key: 'books', label: 'Books', defaultVisible: false },
  { key: 'blogs', label: 'Blogs', defaultVisible: false },
  { key: 'articles', label: 'Articles', defaultVisible: false },
  { key: 'stories', label: 'Stories', defaultVisible: false },
  { key: 'poems', label: 'Poems', defaultVisible: false },
  { key: 'orders', label: 'Orders', defaultVisible: true },
  { key: 'wallet', label: 'Wallet', defaultVisible: false },
  { key: 'lastLogin', label: 'Last Login', defaultVisible: true },
  { key: 'createdAt', label: 'Created Date', defaultVisible: true },
  { key: 'actions', label: 'Actions', defaultVisible: true },
];

const ROW_ACTIONS = [
  'View',
  'Edit',
  'Assign Role',
  'Suspend',
  'Block',
  'Reset Password',
  'Send Email',
  'Send Notification',
  'Login As User',
  'Delete',
] as const;

const BULK_ACTIONS = ['Assign Role', 'Suspend', 'Block', 'Delete', 'Export', 'Send Notification'] as const;

const STATUS_STYLES: Record<AllUsersRecord['status'], string> = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  suspended: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  blocked: 'bg-red-500/15 text-red-400 border-red-500/30',
  pending: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
};

const MEMBERSHIP_STYLES: Record<AllUsersRecord['membership'], string> = {
  free: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  basic: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  premium: 'bg-gold-500/15 text-gold-400 border-gold-500/30',
  lifetime: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

const VERIFICATION_STYLES: Record<AllUsersRecord['verification'], string> = {
  verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  unverified: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

function formatDate(iso: string): string {
  if (iso === '—') return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  if (iso === '—') return '—';
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

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-navy-700 bg-navy-800/50 p-4">
      <div className="h-3 w-20 rounded bg-navy-700" />
      <div className="mt-3 h-7 w-16 rounded bg-navy-700" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4">
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

function FilterSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-navy-700 bg-navy-800/50 p-4" aria-hidden="true">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-navy-700" />
        ))}
      </div>
    </div>
  );
}

const StatCard = memo(function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <article
      className="rounded-xl border border-navy-700 bg-navy-800/50 p-4 transition-colors hover:border-gold-500/30"
      aria-label={`${label}: ${value.toLocaleString()}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
        <Icon className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{value.toLocaleString()}</p>
    </article>
  );
});

const UserAvatar = memo(function UserAvatar({ name }: { name: string }) {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-400 ring-1 ring-gold-500/30"
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
});

interface RowActionMenuProps {
  userId: string;
  menuId: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const RowActionMenu = memo(function RowActionMenu({ userId, menuId, isOpen, onToggle, onClose }: RowActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        id={`${menuId}-trigger`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={`Actions for user ${userId}`}
        onClick={onToggle}
        className={`${TOOLBAR_CONTROL_CLASS} h-8 w-8 justify-center border-navy-600 bg-navy-900/60 px-0 hover:bg-navy-700`}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {isOpen ? (
        <ul
          id={menuId}
          role="menu"
          aria-labelledby={`${menuId}-trigger`}
          className="absolute right-0 z-30 mt-1 min-w-[11rem] rounded-lg border border-navy-600 bg-navy-800 py-1 shadow-lg"
        >
          {ROW_ACTIONS.map((action) => (
            <li key={action} role="none">
              <button
                type="button"
                role="menuitem"
                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-navy-700 focus:bg-navy-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
                  action === 'Delete' ? 'text-red-400' : 'text-gray-200'
                }`}
                onClick={onClose}
              >
                {action}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});

export const AllUsersManagementPanel = memo(function AllUsersManagementPanel({
  previewState = 'ready',
}: AllUsersManagementPanelProps) {
  const tableId = useId();
  const columnMenuId = useId();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [registrationDateFilter, setRegistrationDateFilter] = useState('');
  const [lastLoginFilter, setLastLoginFilter] = useState('');
  const [activeSavedFilter, setActiveSavedFilter] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<AllUsersColumnKey>>(
    () => new Set(COLUMN_DEFINITIONS.filter((c) => c.defaultVisible).map((c) => c.key)),
  );
  const [advancedGroups, setAdvancedGroups] = useState<AdvancedSearchGroup[]>([
    { id: 'g1', operator: 'AND', field: 'name', value: '' },
    { id: 'g2', operator: 'OR', field: 'email', value: '' },
  ]);
  const [localPreviewState, setLocalPreviewState] = useState<AllUsersUiPreviewState>(previewState);

  const columnMenuRef = useRef<HTMLDivElement>(null);
  const stats = useMemo(() => computeSampleStats(SAMPLE_USERS), []);

  const filteredUsers = useMemo(() => {
    if (localPreviewState === 'empty') return [];

    let result = [...SAMPLE_USERS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.phone.includes(q),
      );
    }

    if (roleFilter) result = result.filter((u) => u.roles.includes(roleFilter as AllUsersRecord['roles'][number]));
    if (statusFilter) result = result.filter((u) => u.status === statusFilter);
    if (membershipFilter) result = result.filter((u) => u.membership === membershipFilter);
    if (verificationFilter) result = result.filter((u) => u.verification === verificationFilter);
    if (countryFilter) result = result.filter((u) => u.country === countryFilter);
    if (stateFilter) result = result.filter((u) => u.state === stateFilter);
    if (cityFilter) result = result.filter((u) => u.city === cityFilter);

    if (activeSavedFilter === 'my-authors') result = result.filter((u) => u.roles.includes('author'));
    if (activeSavedFilter === 'premium') result = result.filter((u) => u.membership === 'premium');
    if (activeSavedFilter === 'suspended') result = result.filter((u) => u.status === 'suspended');
    if (activeSavedFilter === 'blocked') result = result.filter((u) => u.status === 'blocked');
    if (activeSavedFilter === 'pending-verification') result = result.filter((u) => u.verification === 'pending');

    return result;
  }, [
    searchQuery,
    roleFilter,
    statusFilter,
    membershipFilter,
    verificationFilter,
    countryFilter,
    stateFilter,
    cityFilter,
    activeSavedFilter,
    localPreviewState,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const allPageSelected =
    paginatedUsers.length > 0 && paginatedUsers.every((u) => selectedIds.has(u.id));
  const somePageSelected = paginatedUsers.some((u) => selectedIds.has(u.id));

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setRoleFilter('');
    setStatusFilter('');
    setMembershipFilter('');
    setVerificationFilter('');
    setCountryFilter('');
    setStateFilter('');
    setCityFilter('');
    setRegistrationDateFilter('');
    setLastLoginFilter('');
    setActiveSavedFilter(null);
    setCurrentPage(1);
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        paginatedUsers.forEach((u) => next.delete(u.id));
      } else {
        paginatedUsers.forEach((u) => next.add(u.id));
      }
      return next;
    });
  }, [allPageSelected, paginatedUsers]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleColumn = useCallback((key: AllUsersColumnKey) => {
    if (key === 'select' || key === 'actions') return;
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!showColumnManager) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target as Node)) {
        setShowColumnManager(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnManager]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter, membershipFilter, verificationFilter, pageSize]);

  const isColumnVisible = (key: AllUsersColumnKey) => visibleColumns.has(key);

  const showEmptyState = localPreviewState === 'empty' || (localPreviewState === 'ready' && filteredUsers.length === 0);
  const showLoading = localPreviewState === 'loading';
  const showError = localPreviewState === 'error';

  return (
    <div className="space-y-6">
      {/* UI validation controls — local preview only, no backend */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-navy-600 bg-navy-900/40 px-3 py-2"
        role="group"
        aria-label="UI preview state (development only)"
      >
        <span className="text-xs text-gray-500">Preview:</span>
        {(['ready', 'loading', 'error', 'empty'] as const).map((state) => (
          <button
            key={state}
            type="button"
            aria-pressed={localPreviewState === state}
            onClick={() => setLocalPreviewState(state)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
              localPreviewState === state
                ? 'bg-gold-500/20 text-gold-400'
                : 'text-gray-400 hover:bg-navy-700 hover:text-gray-200'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      <PageHeader
        title="User Management"
        subtitle="Manage every user on the platform."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <PrimaryButton placeholder className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create User
            </PrimaryButton>
            <SecondaryButton placeholder disabled={false} className="gap-2">
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Import</span>
            </SecondaryButton>
            <SecondaryButton placeholder disabled={false} className="gap-2">
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Export</span>
            </SecondaryButton>
          </div>
        }
      />

      {/* Statistics */}
      <section aria-label="User statistics">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {showLoading ? (
            Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <StatCard label="Total Users" value={stats.totalUsers} icon={Users} />
              <StatCard label="Readers" value={stats.readers} icon={BookOpen} />
              <StatCard label="Authors" value={stats.authors} icon={FileText} />
              <StatCard label="Publishers" value={stats.publishers} icon={LayoutGrid} />
              <StatCard label="Platform Admins" value={stats.platformAdmins} icon={UserCog} />
              <StatCard label="Super Admins" value={stats.superAdmins} icon={Shield} />
              <StatCard label="New Today" value={stats.newToday} icon={UserCheck} />
              <StatCard label="Active Today" value={stats.activeToday} icon={UserCheck} />
            </>
          )}
        </div>
      </section>

      {/* Search */}
      <section aria-label="Global search" className={TOOLBAR_SHELL_CLASS}>
        <SearchInput
          id="all-users-search"
          label="Search users"
          placeholder="Search by name, email, username, phone..."
          value={searchQuery}
          onChange={setSearchQuery}
          disabled={showLoading}
        />
      </section>

      {/* Saved filters */}
      <section aria-label="Saved filters">
        <div className="flex flex-wrap gap-2">
          {SAVED_FILTER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              aria-pressed={activeSavedFilter === preset.id}
              onClick={() =>
                setActiveSavedFilter((prev) => (prev === preset.id ? null : preset.id))
              }
              className={`inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
                activeSavedFilter === preset.id
                  ? 'border-gold-500/50 bg-gold-500/15 text-gold-400'
                  : 'border-navy-600 bg-navy-800/50 text-gray-300 hover:border-navy-500 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      {/* Filter bar */}
      {showLoading ? (
        <FilterSkeleton />
      ) : (
        <section aria-label="Filters" className={`${TOOLBAR_SHELL_CLASS} space-y-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Filter className="h-4 w-4 text-gold-400" aria-hidden="true" />
              Filters
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-expanded={showAdvancedSearch}
                aria-controls="advanced-search-panel"
                onClick={() => setShowAdvancedSearch((v) => !v)}
                className={`${TOOLBAR_CONTROL_CLASS} gap-1.5 border-navy-600 bg-navy-900/60 px-3 hover:bg-navy-700`}
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Advanced Search
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showAdvancedSearch ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 bg-navy-900/60 px-3 hover:bg-navy-700`}
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10">
            {[
              { label: 'Role', value: roleFilter, onChange: setRoleFilter, options: ['', 'reader', 'author', 'publisher', 'admin', 'super_admin'] },
              { label: 'Status', value: statusFilter, onChange: setStatusFilter, options: ['', 'active', 'suspended', 'blocked', 'pending'] },
              { label: 'Membership', value: membershipFilter, onChange: setMembershipFilter, options: ['', 'free', 'basic', 'premium', 'lifetime'] },
              { label: 'Verification', value: verificationFilter, onChange: setVerificationFilter, options: ['', 'verified', 'pending', 'rejected', 'unverified'] },
              { label: 'Country', value: countryFilter, onChange: setCountryFilter, options: ['', 'India'] },
              { label: 'State', value: stateFilter, onChange: setStateFilter, options: ['', 'Maharashtra', 'Karnataka', 'Gujarat', 'Telangana', 'Delhi', 'Rajasthan', 'Kerala', 'Tamil Nadu'] },
              { label: 'City', value: cityFilter, onChange: setCityFilter, options: ['', 'Pune', 'Bengaluru', 'Ahmedabad', 'Mumbai', 'Hyderabad', 'New Delhi', 'Jaipur', 'Kochi', 'Chennai'] },
              { label: 'Registration Date', value: registrationDateFilter, onChange: setRegistrationDateFilter, options: ['', 'today', 'last_7_days', 'last_30_days', 'this_year'] },
              { label: 'Last Login', value: lastLoginFilter, onChange: setLastLoginFilter, options: ['', 'today', 'last_7_days', 'last_30_days', 'never'] },
            ].map((filter) => (
              <div key={filter.label}>
                <label htmlFor={`filter-${filter.label}`} className={FILTER_INLINE_LABEL_CLASS}>
                  {filter.label}
                </label>
                <select
                  id={`filter-${filter.label}`}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={FILTER_INLINE_SELECT_CLASS}
                >
                  {filter.options.map((opt) => (
                    <option key={opt || 'all'} value={opt}>
                      {opt ? opt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All'}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {showAdvancedSearch ? (
            <div
              id="advanced-search-panel"
              className="rounded-lg border border-navy-600 bg-navy-900/40 p-4"
              role="region"
              aria-label="Advanced search"
            >
              <p className="mb-3 text-xs text-gray-400">
                Build query groups with AND / OR logic. UI preview only — not connected to data.
              </p>
              <div className="space-y-3">
                {advancedGroups.map((group, index) => (
                  <div key={group.id} className="flex flex-wrap items-end gap-3">
                    {index > 0 ? (
                      <div className="w-full text-xs font-semibold uppercase tracking-wide text-gold-400">
                        {group.operator}
                      </div>
                    ) : null}
                    <div className="w-20">
                      <label htmlFor={`adv-op-${group.id}`} className={FILTER_LABEL_CLASS}>
                        Operator
                      </label>
                      <select
                        id={`adv-op-${group.id}`}
                        value={group.operator}
                        onChange={(e) =>
                          setAdvancedGroups((prev) =>
                            prev.map((g) =>
                              g.id === group.id ? { ...g, operator: e.target.value as 'AND' | 'OR' } : g,
                            ),
                          )
                        }
                        className={FILTER_POPOVER_SELECT_CLASS}
                      >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                    </div>
                    <div className="min-w-[8rem] flex-1">
                      <label htmlFor={`adv-field-${group.id}`} className={FILTER_LABEL_CLASS}>
                        Field
                      </label>
                      <select
                        id={`adv-field-${group.id}`}
                        value={group.field}
                        onChange={(e) =>
                          setAdvancedGroups((prev) =>
                            prev.map((g) => (g.id === group.id ? { ...g, field: e.target.value } : g)),
                          )
                        }
                        className={FILTER_POPOVER_SELECT_CLASS}
                      >
                        <option value="name">Name</option>
                        <option value="email">Email</option>
                        <option value="username">Username</option>
                        <option value="phone">Phone</option>
                        <option value="role">Role</option>
                        <option value="status">Status</option>
                      </select>
                    </div>
                    <div className="min-w-[10rem] flex-1">
                      <label htmlFor={`adv-value-${group.id}`} className={FILTER_LABEL_CLASS}>
                        Value
                      </label>
                      <input
                        id={`adv-value-${group.id}`}
                        type="text"
                        value={group.value}
                        onChange={(e) =>
                          setAdvancedGroups((prev) =>
                            prev.map((g) => (g.id === group.id ? { ...g, value: e.target.value } : g)),
                          )
                        }
                        placeholder="Enter value..."
                        className={FILTER_POPOVER_SELECT_CLASS}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove search group ${index + 1}`}
                      onClick={() => setAdvancedGroups((prev) => prev.filter((g) => g.id !== group.id))}
                      className={`${TOOLBAR_CONTROL_CLASS} mb-0.5 h-10 border-navy-600 px-3 hover:bg-navy-700`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setAdvancedGroups((prev) => [
                    ...prev,
                    { id: `g${Date.now()}`, operator: 'OR', field: 'name', value: '' },
                  ])
                }
                className="mt-3 text-sm text-gold-400 hover:text-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
              >
                + Add Group
              </button>
            </div>
          ) : null}
        </section>
      )}

      {/* Bulk action bar */}
      {selectedIds.size > 0 && !showLoading && !showError ? (
        <div
          role="toolbar"
          aria-label="Bulk actions"
          className="sticky top-0 z-20 flex flex-wrap items-center gap-3 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-3"
        >
          <span className="text-sm font-medium text-gold-400">
            {selectedIds.size} selected
          </span>
          <div className="flex flex-wrap gap-2">
            {BULK_ACTIONS.map((action) => (
              <button
                key={action}
                type="button"
                className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 bg-navy-800 px-3 py-1.5 text-xs hover:bg-navy-700 ${
                  action === 'Delete' ? 'text-red-400' : ''
                }`}
              >
                {action}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs text-gray-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
          >
            Clear selection
          </button>
        </div>
      ) : null}

      {/* Table area */}
      <section
        aria-label="Users table"
        className="overflow-hidden rounded-xl border border-navy-700 bg-navy-800/50"
      >
        {/* Table toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-700 px-4 py-3">
          <p className="text-sm text-gray-400">
            {showLoading ? 'Loading users...' : `${filteredUsers.length} users`}
          </p>
          <div className="relative" ref={columnMenuRef}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={showColumnManager}
              aria-controls={columnMenuId}
              onClick={() => setShowColumnManager((v) => !v)}
              className={`${TOOLBAR_CONTROL_CLASS} gap-1.5 border-navy-600 bg-navy-900/60 px-3 hover:bg-navy-700`}
            >
              <Columns3 className="h-4 w-4" aria-hidden="true" />
              Columns
            </button>
            {showColumnManager ? (
              <div
                id={columnMenuId}
                role="dialog"
                aria-label="Column visibility"
                className="absolute right-0 z-30 mt-1 max-h-72 w-56 overflow-y-auto rounded-lg border border-navy-600 bg-navy-800 py-2 shadow-lg"
              >
                {COLUMN_DEFINITIONS.filter((c) => c.key !== 'select' && c.key !== 'actions').map((col) => (
                  <label
                    key={col.key}
                    className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-gray-200 hover:bg-navy-700"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-navy-500 text-gold-500 focus:ring-gold-400/50"
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {showError ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
              <AlertCircle className="h-8 w-8 text-red-400" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-white">Unable to load users</h2>
            <p className="mt-2 max-w-sm text-sm text-gray-400">
              Something went wrong while fetching the user list. Please try again.
            </p>
            <button
              type="button"
              onClick={() => setLocalPreviewState('ready')}
              className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry
            </button>
          </div>
        ) : showLoading ? (
          <TableSkeleton />
        ) : showEmptyState ? (
          <EmptyState
            icon={UserX}
            title="No users found"
            description="Try adjusting your search or filters to find what you are looking for."
            ariaLabel="No users found"
            shellClassName="border-0 bg-transparent shadow-none dark:bg-transparent"
          >
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
            >
              Clear Filters
            </button>
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table id={tableId} className="w-full min-w-[80rem] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-700 bg-navy-900/40">
                  {isColumnVisible('select') ? (
                    <th scope="col" className="sticky left-0 z-10 bg-navy-900/95 px-3 py-3">
                      <input
                        type="checkbox"
                        aria-label="Select all users on this page"
                        checked={allPageSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = somePageSelected && !allPageSelected;
                        }}
                        onChange={toggleSelectAll}
                        className="rounded border-navy-500 text-gold-500 focus:ring-gold-400/50"
                      />
                    </th>
                  ) : null}
                  {isColumnVisible('avatar') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Avatar
                    </th>
                  ) : null}
                  {isColumnVisible('userId') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      User ID
                    </th>
                  ) : null}
                  {isColumnVisible('name') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Name
                    </th>
                  ) : null}
                  {isColumnVisible('username') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Username
                    </th>
                  ) : null}
                  {isColumnVisible('email') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Email
                    </th>
                  ) : null}
                  {isColumnVisible('phone') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Phone
                    </th>
                  ) : null}
                  {isColumnVisible('roles') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Roles
                    </th>
                  ) : null}
                  {isColumnVisible('status') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Status
                    </th>
                  ) : null}
                  {isColumnVisible('membership') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Membership
                    </th>
                  ) : null}
                  {isColumnVisible('verification') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Verification
                    </th>
                  ) : null}
                  {isColumnVisible('books') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Books
                    </th>
                  ) : null}
                  {isColumnVisible('blogs') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Blogs
                    </th>
                  ) : null}
                  {isColumnVisible('articles') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Articles
                    </th>
                  ) : null}
                  {isColumnVisible('stories') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Stories
                    </th>
                  ) : null}
                  {isColumnVisible('poems') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Poems
                    </th>
                  ) : null}
                  {isColumnVisible('orders') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Orders
                    </th>
                  ) : null}
                  {isColumnVisible('wallet') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Wallet
                    </th>
                  ) : null}
                  {isColumnVisible('lastLogin') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Last Login
                    </th>
                  ) : null}
                  {isColumnVisible('createdAt') ? (
                    <th scope="col" className="px-3 py-3 font-medium text-gray-400">
                      Created Date
                    </th>
                  ) : null}
                  {isColumnVisible('actions') ? (
                    <th scope="col" className="sticky right-0 z-10 bg-navy-900/95 px-3 py-3 font-medium text-gray-400">
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`border-b border-navy-700/60 transition-colors hover:bg-navy-700/30 ${
                      selectedIds.has(user.id) ? 'bg-gold-500/5' : ''
                    }`}
                  >
                    {isColumnVisible('select') ? (
                      <td className="sticky left-0 z-10 bg-navy-800/95 px-3 py-3">
                        <input
                          type="checkbox"
                          aria-label={`Select ${user.name}`}
                          checked={selectedIds.has(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="rounded border-navy-500 text-gold-500 focus:ring-gold-400/50"
                        />
                      </td>
                    ) : null}
                    {isColumnVisible('avatar') ? (
                      <td className="px-3 py-3">
                        <UserAvatar name={user.name} />
                      </td>
                    ) : null}
                    {isColumnVisible('userId') ? (
                      <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-gray-400">{user.id}</td>
                    ) : null}
                    {isColumnVisible('name') ? (
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-white">{user.name}</td>
                    ) : null}
                    {isColumnVisible('username') ? (
                      <td className="whitespace-nowrap px-3 py-3 text-gray-300">@{user.username}</td>
                    ) : null}
                    {isColumnVisible('email') ? (
                      <td className="whitespace-nowrap px-3 py-3 text-gray-300">{user.email}</td>
                    ) : null}
                    {isColumnVisible('phone') ? (
                      <td className="whitespace-nowrap px-3 py-3 text-gray-300">{user.phone}</td>
                    ) : null}
                    {isColumnVisible('roles') ? (
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <RoleBadge key={role} role={role} />
                          ))}
                        </div>
                      </td>
                    ) : null}
                    {isColumnVisible('status') ? (
                      <td className="px-3 py-3">
                        <StatusBadge
                          label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          styleClass={STATUS_STYLES[user.status]}
                          ariaLabel={`Status: ${user.status}`}
                        />
                      </td>
                    ) : null}
                    {isColumnVisible('membership') ? (
                      <td className="px-3 py-3">
                        <StatusBadge
                          label={user.membership.charAt(0).toUpperCase() + user.membership.slice(1)}
                          styleClass={MEMBERSHIP_STYLES[user.membership]}
                          ariaLabel={`Membership: ${user.membership}`}
                        />
                      </td>
                    ) : null}
                    {isColumnVisible('verification') ? (
                      <td className="px-3 py-3">
                        <StatusBadge
                          label={user.verification.charAt(0).toUpperCase() + user.verification.slice(1)}
                          styleClass={VERIFICATION_STYLES[user.verification]}
                          ariaLabel={`Verification: ${user.verification}`}
                        />
                      </td>
                    ) : null}
                    {isColumnVisible('books') ? (
                      <td className="px-3 py-3 tabular-nums text-gray-300">{user.books}</td>
                    ) : null}
                    {isColumnVisible('blogs') ? (
                      <td className="px-3 py-3 tabular-nums text-gray-300">{user.blogs}</td>
                    ) : null}
                    {isColumnVisible('articles') ? (
                      <td className="px-3 py-3 tabular-nums text-gray-300">{user.articles}</td>
                    ) : null}
                    {isColumnVisible('stories') ? (
                      <td className="px-3 py-3 tabular-nums text-gray-300">{user.stories}</td>
                    ) : null}
                    {isColumnVisible('poems') ? (
                      <td className="px-3 py-3 tabular-nums text-gray-300">{user.poems}</td>
                    ) : null}
                    {isColumnVisible('orders') ? (
                      <td className="px-3 py-3 tabular-nums text-gray-300">{user.orders}</td>
                    ) : null}
                    {isColumnVisible('wallet') ? (
                      <td className="px-3 py-3 tabular-nums text-gray-300">
                        ₹{user.walletBalance.toLocaleString('en-IN')}
                      </td>
                    ) : null}
                    {isColumnVisible('lastLogin') ? (
                      <td className="whitespace-nowrap px-3 py-3 text-gray-400">{formatDateTime(user.lastLogin)}</td>
                    ) : null}
                    {isColumnVisible('createdAt') ? (
                      <td className="whitespace-nowrap px-3 py-3 text-gray-400">{formatDate(user.createdAt)}</td>
                    ) : null}
                    {isColumnVisible('actions') ? (
                      <td className="sticky right-0 z-10 bg-navy-800/95 px-3 py-3">
                        <RowActionMenu
                          userId={user.id}
                          menuId={`row-menu-${user.id}`}
                          isOpen={openMenuId === user.id}
                          onToggle={() => setOpenMenuId((prev) => (prev === user.id ? null : user.id))}
                          onClose={() => setOpenMenuId(null)}
                        />
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!showLoading && !showError && !showEmptyState ? (
          <div
            className="flex flex-col gap-3 border-t border-navy-700 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            aria-label="Pagination"
          >
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="page-size" className="text-xs text-gray-400">
                Rows per page
              </label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-9 rounded-lg border border-navy-600 bg-navy-900/60 px-2 text-sm text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 bg-navy-900/60 px-4 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Previous
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`${TOOLBAR_CONTROL_CLASS} border-navy-600 bg-navy-900/60 px-4 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
});

export default AllUsersManagementPanel;
