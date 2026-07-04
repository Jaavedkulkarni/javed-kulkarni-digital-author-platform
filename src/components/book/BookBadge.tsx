import type { BookStatus } from './bookTypes';
import { BOOK_STATUS_LABELS, BOOK_STATUS_STYLES } from './bookTypes';

interface BookBadgeProps {
  status: BookStatus;
  className?: string;
}

export function BookBadge({ status, className = '' }: BookBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium ${BOOK_STATUS_STYLES[status]} ${className}`}
    >
      {BOOK_STATUS_LABELS[status]}
    </span>
  );
}

export default BookBadge;
