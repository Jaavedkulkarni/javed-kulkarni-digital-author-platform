import type { KeyboardEvent, MouseEvent } from 'react';
import { memo } from 'react';
import { BookCover, BookMetadata } from '../book';
import type { BookCardState } from '../book';
import { WishlistBookMenu } from './WishlistBookMenu';
import {
  WishlistDiscountBadge,
  WishlistPrimaryButton,
  WishlistSecondaryButton,
} from './wishlistUi';
import type { WishlistBookItem } from './wishlistTypes';
import { AVAILABILITY_LABELS, AVAILABILITY_STYLES } from './wishlistTypes';

interface WishlistBookCardProps {
  book: WishlistBookItem;
  state?: BookCardState;
  compact?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const CARD_STYLES: Record<BookCardState, string> = {
  normal:
    'border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800',
  selected:
    'border-brand ring-2 ring-brand/30 bg-white shadow-md dark:border-gold-500/40 dark:bg-navy-800 dark:ring-gold-500/20',
  disabled: 'border-gray-200 bg-white opacity-60 shadow-sm dark:border-navy-700 dark:bg-navy-800',
  loading: 'border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800',
  empty:
    'border-dashed border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800',
};

const PLACEHOLDER = '—';

function stopInteraction(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation();
}

export const WishlistBookCard = memo(function WishlistBookCard({
  book,
  state = 'normal',
  compact = false,
  selected = false,
  onSelect,
}: WishlistBookCardProps) {
  const isLoading = state === 'loading';
  const isDisabled = state === 'disabled' || isLoading;
  const isSelectable = !isDisabled && Boolean(onSelect);
  const title = book.title ?? 'Book';
  const visualState: BookCardState = selected ? 'selected' : state;
  const discountLabel =
    book.discountPercent && book.discountPercent > 0 ? `${book.discountPercent}% OFF` : undefined;

  const handleSelect = () => {
    if (isSelectable) onSelect?.();
  };

  const handleSelectKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  const coverSizeClass = compact ? 'sm:w-36 sm:shrink-0' : 'relative mb-4';

  return (
    <article
      aria-label={`${title} by ${book.author ?? 'Unknown author'}`}
      aria-disabled={isDisabled}
      data-variant="wishlist"
      data-state={visualState}
      className={`relative flex h-full flex-col rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 ${CARD_STYLES[visualState]}`}
    >
      <div
        role="button"
        tabIndex={isSelectable ? 0 : -1}
        aria-selected={selected}
        aria-label={`Select ${title}`}
        onClick={handleSelect}
        onKeyDown={handleSelectKeyDown}
        className={`flex min-h-0 flex-1 cursor-pointer flex-col rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
          compact ? 'gap-4 sm:flex-row sm:items-start' : ''
        }`}
      >
        <div className={coverSizeClass}>
          <BookCover
            src={book.coverUrl}
            alt={book.coverAlt ?? `${title} cover`}
            size={compact ? 'sm' : 'md'}
            loading={isLoading}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <BookMetadata
            title={book.title}
            author={book.author}
            language={book.language}
            category={book.category}
            format={book.format}
            loading={isLoading}
            compact
          />

          <div className="space-y-2">
            <div className="flex min-h-7 flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-lg font-bold tabular-nums text-navy-900 dark:text-white">
                {book.price ?? PLACEHOLDER}
              </span>
              {book.originalPrice ? (
                <span className="text-sm tabular-nums text-gray-400 line-through dark:text-gray-500">
                  {book.originalPrice}
                </span>
              ) : null}
              <WishlistDiscountBadge label={discountLabel} />
            </div>

            <div className="min-h-6">
              {book.availability ? (
                <span
                  className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none ${AVAILABILITY_STYLES[book.availability]}`}
                >
                  {AVAILABILITY_LABELS[book.availability]}
                </span>
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Availability: {PLACEHOLDER}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Added: {book.addedDate ?? PLACEHOLDER}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`z-10 ${compact ? 'absolute right-5 top-5 sm:right-6 sm:top-6' : 'absolute right-6 top-6 sm:right-7 sm:top-7'}`}
        onClick={stopInteraction}
        onKeyDown={stopInteraction}
        onMouseDown={stopInteraction}
      >
        <WishlistBookMenu bookTitle={title} disabled={isDisabled} />
      </div>

      <div
        className="relative z-10 mt-4 flex flex-col gap-2 sm:flex-row"
        onClick={stopInteraction}
        onKeyDown={stopInteraction}
        onMouseDown={stopInteraction}
      >
        <WishlistPrimaryButton placeholderLabel="Buy Now" />
        <WishlistSecondaryButton placeholderLabel="Read Sample" />
      </div>
    </article>
  );
});

export default WishlistBookCard;
