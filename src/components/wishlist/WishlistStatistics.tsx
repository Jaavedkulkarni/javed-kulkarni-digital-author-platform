import { StatisticCard } from '../library/StatisticCard';

const WISHLIST_STATS = [
  { label: 'Total Wishlist Books', key: 'total' },
  { label: 'Books on Discount', key: 'discount' },
  { label: 'Membership Available', key: 'membership' },
  { label: 'Price Drop Alerts', key: 'alerts' },
] as const;

export function WishlistStatistics() {
  return (
    <section aria-label="Wishlist statistics" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {WISHLIST_STATS.map((stat) => (
        <StatisticCard key={stat.key} label={stat.label} />
      ))}
    </section>
  );
}

export default WishlistStatistics;
