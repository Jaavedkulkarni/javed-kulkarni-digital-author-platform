import { memo } from 'react';
import { StatisticsGrid } from '../shared/statistics/StatisticsGrid';
import { StatisticItem } from '../shared/statistics/StatisticItem';
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
    <StatisticsGrid ariaLabel="Order statistics" columnsClass="lg:grid-cols-5">
      {ORDER_STATS.map((stat) => (
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

export default OrderStatistics;
