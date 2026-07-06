import { ShoppingBag } from 'lucide-react';
import { EmptyState, EmptyStateLink } from '../shared/states/EmptyState';
import { NoResultsState } from '../shared/states/NoResultsState';

type OrderStateVariant = 'empty' | 'no-results';

interface OrderStatePanelProps {
  variant: OrderStateVariant;
}

export function OrderStatePanel({ variant }: OrderStatePanelProps) {
  if (variant === 'no-results') {
    return (
      <NoResultsState
        title="No orders match your search or filters."
        description="Try adjusting your search or filter criteria."
        ariaLabel="No matching orders"
      />
    );
  }

  return (
    <EmptyState
      icon={ShoppingBag}
      title="No Orders Yet"
      description="Your purchased books will appear here after successful payment."
      ariaLabel="No orders yet"
    >
      <EmptyStateLink to="/#books">Browse Books</EmptyStateLink>
    </EmptyState>
  );
}

export default OrderStatePanel;
