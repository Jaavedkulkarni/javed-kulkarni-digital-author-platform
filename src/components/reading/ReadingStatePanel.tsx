import { BookOpen } from 'lucide-react';
import { EmptyState, EmptyStateLink } from '../shared/states/EmptyState';
import { NoResultsState } from '../shared/states/NoResultsState';

type ReadingStateVariant = 'empty' | 'no-results';

interface ReadingStatePanelProps {
  variant: ReadingStateVariant;
}

export function ReadingStatePanel({ variant }: ReadingStatePanelProps) {
  if (variant === 'no-results') {
    return (
      <NoResultsState
        title="No Search Results"
        description="Try adjusting your search or filter criteria."
        ariaLabel="No matching reading progress"
      />
    );
  }

  return (
    <EmptyState
      icon={BookOpen}
      title="No Reading History"
      description="Start reading a book from your library."
      ariaLabel="No reading history"
    >
      <EmptyStateLink to="/reader/library">Browse Library</EmptyStateLink>
    </EmptyState>
  );
}

export default ReadingStatePanel;
