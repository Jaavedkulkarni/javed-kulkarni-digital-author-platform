import { memo } from 'react';
import type { MockLibraryBook } from '../../data/mockLibraryBooks';

interface LibraryBookBadgesProps {
  book: MockLibraryBook;
}

const BADGE_BASE =
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none';

const BADGE_STYLES = {
  downloaded:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-300',
  completed:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300',
  membership:
    'border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-300',
};

export const LibraryBookBadges = memo(function LibraryBookBadges({ book }: LibraryBookBadgesProps) {
  const badges: { key: string; label: string; style: string }[] = [];

  if (book.downloaded) {
    badges.push({ key: 'downloaded', label: 'Downloaded', style: BADGE_STYLES.downloaded });
  }
  if (book.completed) {
    badges.push({ key: 'completed', label: 'Completed', style: BADGE_STYLES.completed });
  }
  if (book.membership) {
    badges.push({ key: 'membership', label: 'Membership', style: BADGE_STYLES.membership });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" aria-label="Book status badges">
      {badges.map((badge) => (
        <span key={badge.key} className={`${BADGE_BASE} ${badge.style}`}>
          {badge.label}
        </span>
      ))}
    </div>
  );
});

export default LibraryBookBadges;
