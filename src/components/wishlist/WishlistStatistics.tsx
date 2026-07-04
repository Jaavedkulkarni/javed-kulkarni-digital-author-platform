import { memo } from 'react';
import { StatisticCard } from '../library/StatisticCard';
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
    <section
      aria-label="Wishlist statistics"
      className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-4"
    >
      {WISHLIST_STATS.map((stat) => (
        <StatisticCard
          key={stat.key}
          label={stat.label}
          value={String(stats[stat.key])}
          ariaLabel={`${stat.label}: ${stats[stat.key]}`}
        />
      ))}
    </section>
  );
});

export default WishlistStatistics;
