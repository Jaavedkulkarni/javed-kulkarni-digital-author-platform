import { DashboardCard } from '../DashboardCard';
import { DashboardEmptyState, DashboardBrandLink } from './dashboardWidgetUi';

export function NotificationsWidget() {
  const notifications: never[] = [];
  const unreadCount = 0;

  return (
    <DashboardCard
      title="Notifications"
      ariaLabel="Notifications widget"
      action={
        unreadCount > 0 ? (
          <span
            className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-gold-500 px-1.5 py-0.5 text-xs font-semibold text-navy-900"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount}
          </span>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500" aria-label="No unread notifications">
            0 unread
          </span>
        )
      }
      footer={
        <DashboardBrandLink to="/reader/settings">View All Notifications</DashboardBrandLink>
      }
    >
      {notifications.length === 0 ? (
        <DashboardEmptyState message="No notifications" />
      ) : null}
    </DashboardCard>
  );
}

export default NotificationsWidget;
