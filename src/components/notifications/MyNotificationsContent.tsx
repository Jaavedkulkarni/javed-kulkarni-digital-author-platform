/**
 * Notifications UI Version 1.0 — Frozen
 * Sprint 08B mock-data logic integration.
 */
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationsPageHeader } from './NotificationsPageHeader';
import { NotificationsToolbar } from './NotificationsToolbar';
import { NotificationsStatistics } from './NotificationsStatistics';
import { NotificationsList } from './NotificationsList';

export function MyNotificationsContent() {
  const notifications = useNotifications();

  return (
    <div className="space-y-5 sm:space-y-6">
      <NotificationsPageHeader />
      <NotificationsToolbar
        searchQuery={notifications.searchQuery}
        onSearchChange={notifications.setSearchQuery}
        sortKey={notifications.sortKey}
        onSortChange={notifications.setSortKey}
        filters={notifications.filters}
        onFilterChange={notifications.updateFilter}
        onResetFilters={notifications.resetFilters}
        filterOpen={notifications.filterOpen}
        onFilterOpenChange={notifications.setFilterOpen}
        filtersActive={notifications.filtersActive}
        unreadOnly={notifications.unreadOnly}
        onToggleUnreadOnly={notifications.toggleUnreadOnly}
        onMarkAllRead={notifications.markAllRead}
        hasUnread={notifications.hasUnread}
        resultCount={notifications.resultCount}
      />
      <NotificationsStatistics stats={notifications.stats} />
      <NotificationsList
        items={notifications.items}
        datasetEmpty={notifications.datasetEmpty}
        allCleared={notifications.allCleared}
        selectedNotificationId={notifications.selectedNotificationId}
        onSelectNotification={notifications.selectNotification}
        onClearSelection={notifications.clearSelection}
        onMarkRead={notifications.markRead}
        onDeleteNotification={notifications.deleteNotification}
      />
    </div>
  );
}

export default MyNotificationsContent;
