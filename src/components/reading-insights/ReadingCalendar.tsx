import { Calendar } from 'lucide-react';
import { memo } from 'react';
import { DashboardCard } from '../dashboard/DashboardCard';

export const ReadingCalendar = memo(function ReadingCalendar() {
  return (
    <DashboardCard title="Reading Calendar" ariaLabel="Reading calendar placeholder">
      <div className="flex min-h-[10rem] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center dark:border-navy-600 dark:bg-navy-900/40">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-navy-800"
          aria-hidden="true"
        >
          <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-base font-semibold text-navy-900 dark:text-white">Reading Calendar</p>
        <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-300">
          Track your daily reading consistency.
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Coming Soon
        </p>
      </div>
      <p className="sr-only">Reading calendar placeholder. Data not yet available.</p>
    </DashboardCard>
  );
});

export default ReadingCalendar;
