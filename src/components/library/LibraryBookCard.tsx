import { BookOpen, MoreVertical } from 'lucide-react';
import type { LibraryBookItem } from './libraryTypes';
import { STATUS_LABELS, STATUS_STYLES } from './libraryTypes';

interface LibraryBookCardProps {
  book: LibraryBookItem;
}

export function LibraryBookCard({ book }: LibraryBookCardProps) {
  const progressLabel = book.progress > 0 ? `${book.progress}%` : '—';

  return (
    <article
      aria-label={`${book.title} by ${book.author}`}
      className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-gold-400/40 dark:border-navy-700 dark:bg-navy-800 sm:p-5"
    >
      <div className="relative mb-4">
        <div
          role="img"
          aria-label={`${book.title} cover`}
          className="flex h-36 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 dark:border-navy-600 dark:bg-navy-900/60"
        >
          <BookOpen className="h-10 w-10 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        </div>
        <button
          type="button"
          disabled
          aria-label={`More options for ${book.title}`}
          aria-disabled="true"
          className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-navy-800/90 dark:text-gray-500"
        >
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 text-base font-semibold text-navy-900 dark:text-white">{book.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>

        <dl className="mt-1 space-y-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex justify-between gap-2">
            <dt>Language</dt>
            <dd className="text-right text-navy-800 dark:text-gray-300">{book.language}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Category</dt>
            <dd className="text-right text-navy-800 dark:text-gray-300">{book.category}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Purchase Date</dt>
            <dd className="text-right text-navy-800 dark:text-gray-300">{book.purchaseDate}</dd>
          </div>
        </dl>

        <div className="mt-2">
          <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Reading Progress</span>
            <span>{progressLabel}</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={book.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Reading progress for ${book.title}`}
            className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700"
          >
            <div
              className="h-full rounded-full bg-gold-500 transition-all duration-300"
              style={{ width: `${Math.min(book.progress, 100)}%` }}
            />
          </div>
        </div>

        <span
          className={`mt-2 inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[book.status]}`}
        >
          {STATUS_LABELS[book.status]}
        </span>
      </div>

      <button
        type="button"
        disabled
        aria-disabled="true"
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-gold-400/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue Reading
      </button>
    </article>
  );
}

export default LibraryBookCard;
