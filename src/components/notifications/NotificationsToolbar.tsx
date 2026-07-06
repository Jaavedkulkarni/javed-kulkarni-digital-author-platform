import { useEffect, useRef, memo } from 'react';
import type { NotificationFilters as NotificationFilterState, NotificationSortKey } from '../../lib/notificationLogic';
import { PageToolbar } from '../shared/toolbar/PageToolbar';
import { SearchInput } from '../shared/search/SearchInput';
import { SortDropdown } from '../shared/sort/SortDropdown';
import { FilterButton } from '../shared/filters/FilterButton';
import { FilterField, FilterPopover } from '../shared/filters/FilterPanel';
import { NOTIFICATION_CATEGORY_LABELS, NOTIFICATION_SORT_OPTIONS } from './notificationTypes';
import type { NotificationCategory } from './notificationTypes';
import { NotificationPrimaryButton } from './notificationUi';

interface NotificationsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortKey: NotificationSortKey;
  onSortChange: (value: NotificationSortKey) => void;
  filters: NotificationFilterState;
  onFilterChange: <K extends keyof NotificationFilterState>(
    key: K,
    value: NotificationFilterState[K]
  ) => void;
  onResetFilters: () => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  filtersActive: boolean;
  unreadOnly: boolean;
  onToggleUnreadOnly: () => void;
  onMarkAllRead: () => void;
  hasUnread: boolean;
  resultCount: number;
}

const CATEGORIES = Object.keys(NOTIFICATION_CATEGORY_LABELS) as NotificationCategory[];

export const NotificationsToolbar = memo(function NotificationsToolbar({
  searchQuery,
  onSearchChange,
  sortKey,
  onSortChange,
  filters,
  onFilterChange,
  onResetFilters,
  filterOpen,
  onFilterOpenChange,
  filtersActive,
  unreadOnly,
  onToggleUnreadOnly,
  onMarkAllRead,
  hasUnread,
  resultCount,
}: NotificationsToolbarProps) {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        onFilterOpenChange(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onFilterOpenChange(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [filterOpen, onFilterOpenChange]);

  return (
    <PageToolbar
      ariaLabel="Notifications toolbar"
      announcement={`${resultCount} ${resultCount === 1 ? 'notification' : 'notifications'} shown`}
    >
      <SearchInput
        id="notifications-search"
        label="Search notifications"
        placeholder="Search notifications..."
        value={searchQuery}
        onChange={onSearchChange}
      />

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="relative" ref={filterRef}>
          <FilterButton
            ariaLabel={filtersActive ? 'Filter notifications (filters active)' : 'Filter notifications'}
            active={filtersActive}
            open={filterOpen}
            onClick={() => onFilterOpenChange(!filterOpen)}
          />
          <FilterPopover
            open={filterOpen}
            ariaLabel="Notification filters"
            onClose={() => onFilterOpenChange(false)}
            onReset={onResetFilters}
            filtersActive={filtersActive}
          >
            <FilterField
              id="notification-filter-category"
              label="Category"
              value={filters.category}
              onChange={(value) =>
                onFilterChange('category', value as NotificationFilterState['category'])
              }
            >
              <option value="all">All</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {NOTIFICATION_CATEGORY_LABELS[category]}
                </option>
              ))}
            </FilterField>

            <FilterField
              id="notification-filter-read"
              label="Read Status"
              value={filters.read}
              onChange={(value) => onFilterChange('read', value as NotificationFilterState['read'])}
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </FilterField>
          </FilterPopover>
        </div>

        <SortDropdown
          id="notifications-sort"
          label="Sort notifications"
          options={NOTIFICATION_SORT_OPTIONS}
          value={sortKey}
          onChange={onSortChange}
        />

        <button
          type="button"
          aria-pressed={unreadOnly}
          aria-label={unreadOnly ? 'Show all notifications' : 'Show unread notifications only'}
          onClick={onToggleUnreadOnly}
          className={`inline-flex h-10 items-center rounded-lg border px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
            unreadOnly
              ? 'border-brand/40 bg-brand/5 text-brand dark:border-gold-500/30 dark:bg-gold-500/10 dark:text-gold-300'
              : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-900/50 dark:text-gray-300 dark:hover:bg-navy-800'
          }`}
        >
          Unread Only
        </button>

        <NotificationPrimaryButton interactive={hasUnread} onClick={onMarkAllRead}>
          Mark All Read
        </NotificationPrimaryButton>
      </div>
    </PageToolbar>
  );
});

export default NotificationsToolbar;
