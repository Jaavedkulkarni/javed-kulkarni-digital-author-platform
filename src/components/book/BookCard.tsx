import type { KeyboardEvent, MouseEvent } from 'react';
import { BookActionButton } from './BookActionButton';
import { BookBadge } from './BookBadge';
import { BookCover } from './BookCover';
import { BookMenu } from './BookMenu';
import { BookMetadata } from './BookMetadata';
import { BookProgress } from './BookProgress';
import type { BookActionLabel, BookCardData, BookCardState } from './bookTypes';

interface BookCardProps {
  book?: BookCardData;
  state?: BookCardState;
  selected?: boolean;
  onSelect?: () => void;
  actionLabel?: BookActionLabel;
  showProgress?: boolean;
  showMenu?: boolean;
  compact?: boolean;
  className?: string;
  onAction?: () => void;
}

const STATE_STYLES: Record<BookCardState, string> = {
  normal:
    'border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800',
  selected:
    'border-brand ring-2 ring-brand/30 bg-white shadow-md dark:border-gold-500/40 dark:bg-navy-800 dark:ring-gold-500/20',
  disabled: 'border-gray-200 bg-white opacity-60 shadow-sm dark:border-navy-700 dark:bg-navy-800',
  loading: 'border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800',
  empty:
    'border-dashed border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800',
};

function stopInteraction(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation();
}

export function BookCard({
  book,
  state = 'normal',
  selected = false,
  onSelect,
  actionLabel = 'Continue Reading',
  showProgress = true,
  showMenu = true,
  compact = false,
  className = '',
  onAction,
}: BookCardProps) {
  const isLoading = state === 'loading';
  const isEmpty = state === 'empty' || !book;
  const isDisabled = state === 'disabled' || isLoading || isEmpty;
  const isSelectable = !isDisabled && Boolean(onSelect);
  const title = book?.title ?? 'Book';
  const progress = book?.progress ?? 0;
  const visualState: BookCardState = selected ? 'selected' : state;

  const handleSelect = () => {
    if (isSelectable) onSelect?.();
  };

  const handleSelectKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  const handleAction = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onAction?.();
  };

  return (
    <article
      aria-label={isEmpty ? 'Empty book card' : `${title} by ${book?.author ?? 'Unknown author'}`}
      aria-disabled={isDisabled}
      data-state={visualState}
      className={`relative flex h-full flex-col rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 ${STATE_STYLES[visualState]} ${className}`}
    >
      <div
        role="button"
        tabIndex={isSelectable ? 0 : -1}
        aria-selected={selected}
        aria-label={isEmpty ? 'Empty book card' : `Select ${title}`}
        onClick={handleSelect}
        onKeyDown={handleSelectKeyDown}
        className="flex flex-1 cursor-pointer flex-col rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
      >
        <div className="relative mb-4">
          <BookCover
            src={book?.coverUrl}
            alt={book?.coverAlt ?? `${title} cover`}
            size={compact ? 'sm' : 'md'}
            loading={isLoading}
            empty={isEmpty}
          />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <BookMetadata
            title={book?.title}
            author={book?.author}
            language={book?.language}
            category={book?.category}
            format={book?.format}
            publicationDate={book?.publicationDate}
            loading={isLoading}
            empty={isEmpty}
            compact={compact}
          />

          {showProgress ? (
            <BookProgress
              value={isEmpty ? 0 : progress}
              loading={isLoading}
              size={compact ? 'sm' : 'md'}
            />
          ) : null}

          {book?.status && !isEmpty ? <BookBadge status={book.status} /> : null}

          {isEmpty ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">No book data available</p>
          ) : null}
        </div>
      </div>

      {showMenu ? (
        <div
          className="absolute right-6 top-6 z-10 sm:right-7 sm:top-7"
          onClick={stopInteraction}
          onKeyDown={stopInteraction}
          onMouseDown={stopInteraction}
        >
          <BookMenu bookTitle={title} disabled={isDisabled} />
        </div>
      ) : null}

      <div
        className="relative z-10 mt-4"
        onClick={stopInteraction}
        onKeyDown={stopInteraction}
        onMouseDown={stopInteraction}
      >
        <BookActionButton
          label={actionLabel}
          disabled={isDisabled}
          loading={isLoading}
          onClick={handleAction}
        />
      </div>
    </article>
  );
}

export default BookCard;
