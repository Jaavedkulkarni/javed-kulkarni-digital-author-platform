import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WishlistEmptyState() {
  return (
    <div
      role="status"
      aria-label="Empty wishlist"
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm dark:border-navy-700 dark:bg-navy-800 sm:px-10"
    >
      <div
        aria-hidden="true"
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-navy-600 dark:bg-navy-900/50"
      >
        <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600" />
      </div>
      <h2 className="text-lg font-semibold text-navy-900 dark:text-white sm:text-xl">
        Your wishlist is empty.
      </h2>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        Save books you love and they will appear here for easy purchase later.
      </p>
      <Link
        to="/#books"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-gold-400/50"
      >
        Browse Books
      </Link>
    </div>
  );
}

export default WishlistEmptyState;
