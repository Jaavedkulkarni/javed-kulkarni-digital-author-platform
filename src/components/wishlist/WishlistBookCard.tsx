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
}

const CARD_STYLES: Record<BookCardState, string> = {
  normal:
    'border-gray-200 bg-white shadow-sm hover:shadow-md dark:border-navy-700 dark:bg-navy-800',
  selected:
    'border-brand ring-2 ring-brand/30 bg-white shadow-md dark:border-gold-500/40 dark:bg-navy-800 dark:ring-gold-500/20',
  disabled: 'border-gray-200 bg-white opacity-60 shadow-sm dark:border-navy-700 dark:bg-navy-800',
  loading: 'border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800',
  empty:
    'border-dashed border-gray-200 bg-white shadow-sm dark:border-navy-700 dark:bg-navy-800',
};

const PLACEHOLDER = '—';

export function WishlistBookCard({ book, state = 'normal' }: WishlistBookCardProps) {
  const isLoading = state === 'loading';
  const isDisabled = state === 'disabled' || isLoading;
  const title = book.title ?? 'Book';
  const discountLabel =
    book.discountPercent && book.discountPercent > 0 ? `${book.discountPercent}% OFF` : undefined;

  return (
    <article
      aria-label={`${title} by ${book.author ?? 'Unknown author'}`}
      data-variant="wishlist"
      data-state={state}
      className={`flex h-full flex-col rounded-xl border p-4 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-gold-400/40 sm:p-5 ${CARD_STYLES[state]}`}
    >
      <div className="relative mb-4">
        <BookCover
          src={book.coverUrl}
          alt={book.coverAlt ?? `${title} cover`}
          size="md"
          loading={isLoading}
        />
        <div className="absolute right-2 top-2">
          <WishlistBookMenu bookTitle={title} disabled={isDisabled} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <BookMetadata
          title={book.title}
          author={book.author}
          language={book.language}
          category={book.category}
          loading={isLoading}
          compact
        />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-navy-900 dark:text-white">
              {book.price ?? PLACEHOLDER}
            </span>
            {book.originalPrice ? (
              <span className="text-sm text-gray-400 line-through dark:text-gray-500">
                {book.originalPrice}
              </span>
            ) : null}
            <WishlistDiscountBadge label={discountLabel} />
          </div>

          {book.availability ? (
            <span
              className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium ${AVAILABILITY_STYLES[book.availability]}`}
            >
              {AVAILABILITY_LABELS[book.availability]}
            </span>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Availability: {PLACEHOLDER}
            </span>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Added: {book.addedDate ?? PLACEHOLDER}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <WishlistPrimaryButton disabled={isDisabled}>Buy Now</WishlistPrimaryButton>
        <WishlistSecondaryButton disabled={isDisabled}>Read Sample</WishlistSecondaryButton>
      </div>
    </article>
  );
}

export default WishlistBookCard;
