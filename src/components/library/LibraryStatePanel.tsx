import { BookOpen } from 'lucide-react';
import { EmptyState, EmptyStateLink } from '../shared/states/EmptyState';
import { NoResultsState } from '../shared/states/NoResultsState';

type LibraryStateVariant = 'empty' | 'no-results';

interface LibraryStatePanelProps {
  variant: LibraryStateVariant;
}

export function LibraryStatePanel({ variant }: LibraryStatePanelProps) {
  if (variant === 'no-results') {
    return (
      <NoResultsState
        title="No books match your search or filters."
        description="Try adjusting your search or filter criteria."
        ariaLabel="No matching books"
      />
    );
  }

  return (
    <EmptyState
      icon={BookOpen}
      title="No books in your library yet."
      description="Books you purchase or access through membership will appear here."
      ariaLabel="Empty library"
    >
      <EmptyStateLink to="/#books">Browse Books</EmptyStateLink>
    </EmptyState>
  );
}

/** @deprecated Use LibraryStatePanel — kept for freeze compatibility */
export function LibraryEmptyState() {
  return <LibraryStatePanel variant="empty" />;
}

export default LibraryStatePanel;
