import { memo } from 'react';
import type { SettingsNotifications } from '../../data/mockSettings';
import { DashboardCard } from '../dashboard/DashboardCard';
import { SettingsToggleRow } from './settingsUi';

interface NotificationPreferencesProps {
  notifications: SettingsNotifications;
  onToggle: (key: keyof SettingsNotifications) => void;
}

export const NotificationPreferences = memo(function NotificationPreferences({
  notifications,
  onToggle,
}: NotificationPreferencesProps) {
  return (
    <DashboardCard title="Notifications" ariaLabel="Notification preferences">
      <div className="divide-y divide-gray-100 dark:divide-navy-700">
        <SettingsToggleRow
          id="settings-order-notifications"
          label="Order Notifications"
          checked={notifications.orders}
          onChange={() => onToggle('orders')}
        />
        <SettingsToggleRow
          id="settings-membership-notifications"
          label="Membership Notifications"
          checked={notifications.membership}
          onChange={() => onToggle('membership')}
        />
        <SettingsToggleRow
          id="settings-reading-notifications"
          label="Reading Notifications"
          checked={notifications.reading}
          onChange={() => onToggle('reading')}
        />
        <SettingsToggleRow
          id="settings-promotional-emails"
          label="Promotional Emails"
          checked={notifications.promotions}
          onChange={() => onToggle('promotions')}
        />
        <SettingsToggleRow
          id="settings-weekly-summary"
          label="Weekly Summary"
          checked={notifications.weeklySummary}
          onChange={() => onToggle('weeklySummary')}
        />
        <SettingsToggleRow
          id="settings-push-notifications"
          label="Push Notifications"
          checked={notifications.push}
          onChange={() => onToggle('push')}
        />
      </div>
    </DashboardCard>
  );
});

export default NotificationPreferences;
