import { StatisticCard } from '../library/StatisticCard';

const ORDER_STATS = [
  { label: 'Total Orders', key: 'total' },
  { label: 'Completed Orders', key: 'completed' },
  { label: 'Pending Orders', key: 'pending' },
  { label: 'Refunded Orders', key: 'refunded' },
  { label: 'Cancelled Orders', key: 'cancelled' },
] as const;

export function OrderStatistics() {
  return (
    <section
      aria-label="Order statistics"
      className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-5"
    >
      {ORDER_STATS.map((stat) => (
        <StatisticCard key={stat.key} label={stat.label} value="0" ariaLabel={`${stat.label}: 0`} />
      ))}
    </section>
  );
}

export default OrderStatistics;
