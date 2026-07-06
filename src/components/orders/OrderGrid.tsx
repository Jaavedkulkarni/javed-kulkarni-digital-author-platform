import { memo, useEffect } from 'react';
import type { MockOrder } from '../../data/mockOrders';
import type { OrderViewMode } from '../../lib/orderBookLogic';
import { ResponsiveGrid } from '../shared/layout/ResponsiveGrid';
import { OrderItem } from './OrderItem';
import { OrderStatePanel } from './OrderStatePanel';

interface OrderGridProps {
  orders: MockOrder[];
  viewMode: OrderViewMode;
  datasetEmpty: boolean;
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onClearSelection: () => void;
  onViewDetails: (orderId: string) => void;
}

export const OrderGrid = memo(function OrderGrid({
  orders,
  viewMode,
  datasetEmpty,
  selectedOrderId,
  onSelectOrder,
  onClearSelection,
  onViewDetails,
}: OrderGridProps) {
  useEffect(() => {
    if (selectedOrderId && !orders.some((order) => order.id === selectedOrderId)) {
      onClearSelection();
    }
  }, [orders, selectedOrderId, onClearSelection]);

  if (datasetEmpty) {
    return <OrderStatePanel variant="empty" />;
  }

  if (orders.length === 0) {
    return <OrderStatePanel variant="no-results" />;
  }

  return (
    <ResponsiveGrid viewMode={viewMode} ariaLabel="Order history">
      {orders.map((order) => (
        <div key={order.id} role="listitem" className="h-full min-h-0">
          <OrderItem
            order={order}
            selected={selectedOrderId === order.id}
            onSelect={onSelectOrder}
            onViewDetails={onViewDetails}
            compact={viewMode === 'list'}
          />
        </div>
      ))}
    </ResponsiveGrid>
  );
});

export default OrderGrid;
