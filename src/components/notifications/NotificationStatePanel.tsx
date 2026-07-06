import { Bell } from 'lucide-react';
import { EmptyState, EmptyStateLink } from '../shared/states/EmptyState';
import { NoResultsState } from '../shared/states/NoResultsState';

type NotificationStateVariant = 'empty' | 'no-results';

interface NotificationStatePanelProps {
  variant: NotificationStateVariant;
}

export function NotificationStatePanel({ variant }: NotificationStatePanelProps) {
  if (variant === 'no-results') {
    return (
      <NoResultsState
        title="No Search Results"
        description="Try adjusting your search or filter criteria."
        ariaLabel="No matching notifications"
      />
    );
  }

  return (
    <EmptyState
      icon={Bell}
      title="No Notifications"
      description="You're all caught up."
      ariaLabel="No notifications"
    >
      <EmptyStateLink to="/reader/library">Browse Library</EmptyStateLink>
    </EmptyState>
  );
}

export default NotificationStatePanel;
