import type { OrderCardItem, OrderViewMode } from './orderTypes';
import { OrderCard } from './OrderCard';
import { OrderEmptyState } from './OrderEmptyState';

interface OrderGridProps {
  orders?: OrderCardItem[];
  viewMode?: OrderViewMode;
}

export function OrderGrid({ orders = [], viewMode = 'grid' }: OrderGridProps) {
  if (orders.length === 0) {
    return <OrderEmptyState />;
  }

  const listClassName =
    viewMode === 'list'
      ? 'flex flex-col gap-4 sm:gap-5'
      : 'grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div role="list" aria-label="Order history" className={listClassName}>
      {orders.map((order) => (
        <div key={order.id} role="listitem" className="h-full min-h-0">
          <OrderCard order={order} compact={viewMode === 'list'} />
        </div>
      ))}
    </div>
  );
}

export default OrderGrid;
