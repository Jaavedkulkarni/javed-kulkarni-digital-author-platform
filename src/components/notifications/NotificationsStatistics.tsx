import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import type { NotificationStats } from './notificationTypes';

const STAT_CONFIG: { label: string; key: keyof NotificationStats }[] = [
  { label: 'Total Notifications', key: 'total' },
  { label: 'Unread', key: 'unread' },
  { label: 'Orders', key: 'orders' },
  { label: 'Reading', key: 'reading' },
  { label: 'Membership', key: 'membership' },
];

interface NotificationsStatisticsProps {
  stats: NotificationStats;
}

export const NotificationsStatistics = memo(function NotificationsStatistics({
  stats,
}: NotificationsStatisticsProps) {
  return (
    <StatisticsGrid ariaLabel="Notification statistics" columnsClass="lg:grid-cols-5">
      {STAT_CONFIG.map((stat) => (
        <StatisticItem
          key={stat.key}
          label={stat.label}
          value={String(stats[stat.key])}
          ariaLabel={`${stat.label}: ${stats[stat.key]}`}
        />
      ))}
    </StatisticsGrid>
  );
});

export default NotificationsStatistics;
