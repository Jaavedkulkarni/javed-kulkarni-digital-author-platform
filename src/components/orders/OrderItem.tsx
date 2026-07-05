import { memo, useMemo } from 'react';
import type { MockOrder } from '../../data/mockOrders';
import { toOrderCardItem } from '../../lib/orderBookLogic';
import { OrderCard } from './OrderCard';

interface OrderItemProps {
  order: MockOrder;
  selected: boolean;
  onSelect: (orderId: string) => void;
  onViewDetails: (orderId: string) => void;
  compact?: boolean;
}

export const OrderItem = memo(function OrderItem({
  order,
  selected,
  onSelect,
  onViewDetails,
  compact = false,
}: OrderItemProps) {
  const item = useMemo(() => toOrderCardItem(order), [order]);

  return (
    <OrderCard
      order={item}
      compact={compact}
      selected={selected}
      onSelect={() => onSelect(order.id)}
      onViewDetails={() => onViewDetails(order.id)}
    />
  );
});

export default OrderItem;
