import { DashboardCard } from '../DashboardCard';
import { BookCoverPlaceholder, DashboardActionButton, DashboardEmptyState } from './dashboardWidgetUi';

const PLACEHOLDER_SLOTS = 4;

export function RecentBooksWidget() {
  const books: never[] = [];

  return (
    <DashboardCard title="Recent Books" ariaLabel="Recent books widget">
      {books.length === 0 ? (
        <div className="space-y-4">
          <DashboardEmptyState message="No books yet" />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Recent book placeholders">
            {Array.from({ length: PLACEHOLDER_SLOTS }, (_, index) => (
              <li
                key={index}
                className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-3 dark:border-navy-700"
              >
                <BookCoverPlaceholder size="sm" label={`Recent book ${index + 1} cover`} />
                <p className="w-full truncate text-center text-xs text-gray-400 dark:text-gray-500">—</p>
                <DashboardActionButton>Open</DashboardActionButton>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </DashboardCard>
  );
}

export default RecentBooksWidget;
