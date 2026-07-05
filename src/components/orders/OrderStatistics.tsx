import { memo } from 'react';
import { StatisticCard } from '../library/StatisticCard';
import type { OrderStats } from '../../lib/orderBookLogic';

const ORDER_STATS: { label: string; key: keyof OrderStats }[] = [
  { label: 'Total Orders', key: 'total' },
  { label: 'Completed Orders', key: 'completed' },
  { label: 'Pending Orders', key: 'pending' },
  { label: 'Refunded Orders', key: 'refunded' },
  { label: 'Cancelled Orders', key: 'cancelled' },
];

interface OrderStatisticsProps {
  stats: OrderStats;
}

export const OrderStatistics = memo(function OrderStatistics({ stats }: OrderStatisticsProps) {
  return (
    <section
      aria-label="Order statistics"
      className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-5"
    >
      {ORDER_STATS.map((stat) => (
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

export default OrderStatistics;
