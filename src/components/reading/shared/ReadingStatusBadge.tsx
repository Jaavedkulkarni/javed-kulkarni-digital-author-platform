import { memo } from 'react';
import { StatusBadge } from '../../shared/badges/StatusBadge';
import type { ReadingStatus } from '../readingTypes';
import { READING_STATUS_LABELS, READING_STATUS_STYLES } from '../readingTypes';

interface ReadingStatusBadgeProps {
  status?: ReadingStatus;
  label?: string;
  className?: string;
}

export const ReadingStatusBadge = memo(function ReadingStatusBadge({
  status = 'not-started',
  label,
  className = '',
}: ReadingStatusBadgeProps) {
  const displayLabel = label ?? READING_STATUS_LABELS[status];

  return (
    <StatusBadge
      label={displayLabel}
      styleClass={`${READING_STATUS_STYLES[status]} ${className}`}
    />
  );
});

export default ReadingStatusBadge;
