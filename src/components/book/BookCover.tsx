import { BookOpen } from 'lucide-react';

type BookCoverSize = 'sm' | 'md' | 'lg';

interface BookCoverProps {
  src?: string | null;
  alt?: string;
  size?: BookCoverSize;
  loading?: boolean;
  empty?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<BookCoverSize, string> = {
  sm: 'h-24',
  md: 'h-36',
  lg: 'h-44 sm:h-48',
};

const ICON_SIZES: Record<BookCoverSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function BookCover({
  src,
  alt = 'Book cover',
  size = 'md',
  loading = false,
  empty = false,
  className = '',
}: BookCoverProps) {
  const heightClass = SIZE_CLASSES[size];
  const iconClass = ICON_SIZES[size];

  if (loading) {
    return (
      <div
        aria-hidden="true"
        className={`w-full animate-pulse rounded-lg bg-gray-200 dark:bg-navy-700 ${heightClass} ${className}`}
      />
    );
  }

  if (src && !empty) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`aspect-[2/3] w-full rounded-lg border border-gray-200 object-cover dark:border-navy-600 ${heightClass} ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={empty ? 'Book cover unavailable' : alt}
      className={`flex w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 dark:border-navy-600 dark:bg-navy-900/60 ${heightClass} ${className}`}
    >
      <BookOpen className={`text-gray-400 dark:text-gray-500 ${iconClass}`} aria-hidden="true" />
    </div>
  );
}

export default BookCover;
