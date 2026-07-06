import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
import type { WishlistStats } from '../../lib/wishlistBookLogic';

const WISHLIST_STATS: { label: string; key: keyof WishlistStats }[] = [
  { label: 'Total Wishlist Books', key: 'total' },
  { label: 'Discounted Books', key: 'discounted' },
  { label: 'Membership Available', key: 'membershipAvailable' },
  { label: 'Price Drop Alerts', key: 'priceDropAlerts' },
];

interface WishlistStatisticsProps {
  stats: WishlistStats;
}

export const WishlistStatistics = memo(function WishlistStatistics({ stats }: WishlistStatisticsProps) {
  return (
    <StatisticsGrid ariaLabel="Wishlist statistics" columnsClass="lg:grid-cols-4">
      {WISHLIST_STATS.map((stat) => (
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

export default WishlistStatistics;
