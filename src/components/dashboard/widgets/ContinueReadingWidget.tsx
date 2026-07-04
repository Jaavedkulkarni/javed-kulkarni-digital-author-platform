import { DashboardCard } from '../DashboardCard';
import { BookCoverPlaceholder, DashboardActionButton, DashboardEmptyState } from './dashboardWidgetUi';

interface ContinueReadingWidgetProps {
  hero?: boolean;
}

export function ContinueReadingWidget({ hero = false }: ContinueReadingWidgetProps) {
  return (
    <DashboardCard
      title="Continue Reading"
      ariaLabel="Continue reading widget"
      className={
        hero
          ? 'border-brand/30 bg-gradient-to-br from-white to-gray-50 shadow-md ring-1 ring-brand/10 hover:shadow-lg dark:border-gold-500/25 dark:from-navy-800 dark:to-navy-900/80 dark:ring-gold-500/10 sm:p-7'
          : ''
      }
    >
      <div className={`space-y-4 ${hero ? 'sm:space-y-5' : ''}`}>
        <div className={`flex gap-4 ${hero ? 'sm:gap-6' : ''}`}>
          <BookCoverPlaceholder size={hero ? 'lg' : 'md'} />
          <div className="min-w-0 flex-1 space-y-1">
            <p
              className={`font-medium text-gray-400 dark:text-gray-500 ${
                hero ? 'text-base sm:text-lg' : 'text-sm'
              }`}
            >
              Book title unavailable
            </p>
            <p className={`text-gray-400 dark:text-gray-500 ${hero ? 'text-sm' : 'text-xs'}`}>
              Author unavailable
            </p>
            <p className={`text-gray-400 dark:text-gray-500 ${hero ? 'text-sm' : 'text-xs'}`}>
              Current page unavailable
            </p>
          </div>
        </div>

        <DashboardEmptyState message="No books in progress" />

        <div>
          <div className="mb-1.5 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Progress</span>
            <span>—</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
            className={`overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700 ${hero ? 'h-2.5' : 'h-2'}`}
          >
            <div className="h-full w-0 rounded-full bg-gold-500" />
          </div>
        </div>

        <DashboardActionButton>Continue Reading</DashboardActionButton>
      </div>
    </DashboardCard>
  );
}

export default ContinueReadingWidget;
