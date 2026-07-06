import { Heart } from 'lucide-react';
import { EmptyState, EmptyStateLink } from '../shared/states/EmptyState';
import { NoResultsState } from '../shared/states/NoResultsState';

type WishlistStateVariant = 'empty' | 'no-results';

interface WishlistStatePanelProps {
  variant: WishlistStateVariant;
}

export function WishlistStatePanel({ variant }: WishlistStatePanelProps) {
  if (variant === 'no-results') {
    return (
      <NoResultsState
        title="No books match your search or filters."
        description="Try adjusting your search or filter criteria."
        ariaLabel="No matching wishlist books"
      />
    );
  }

  return (
    <EmptyState
      icon={Heart}
      title="Your wishlist is empty."
      description="Save books you love and they will appear here for easy purchase later."
      ariaLabel="Empty wishlist"
    >
      <EmptyStateLink to="/#books">Browse Books</EmptyStateLink>
    </EmptyState>
  );
}

export default WishlistStatePanel;
