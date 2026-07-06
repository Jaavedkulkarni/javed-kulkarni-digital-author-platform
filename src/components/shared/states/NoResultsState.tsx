import { memo } from 'react';
import { Search } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface NoResultsStateProps {
  title?: string;
  description?: string;
  ariaLabel?: string;
}

export const NoResultsState = memo(function NoResultsState({
  title = 'No books match your search or filters.',
  description = 'Try adjusting your search or filter criteria.',
  ariaLabel = 'No matching results',
}: NoResultsStateProps) {
  return (
    <EmptyState
      icon={Search}
      title={title}
      description={description}
      ariaLabel={ariaLabel}
    />
  );
});

export default NoResultsState;
