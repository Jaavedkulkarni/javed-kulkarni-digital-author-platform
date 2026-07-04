import { DashboardCard } from '../DashboardCard';
import { DashboardMetric } from './dashboardWidgetUi';

export function ReadingProgressWidget() {
  return (
    <DashboardCard title="Reading Progress" ariaLabel="Reading progress widget">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DashboardMetric label="Books Completed" value="—" />
          <DashboardMetric label="Books In Progress" value="—" />
          <DashboardMetric label="Current Reading Goal" value="Not set" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Goal progress</span>
            <span>—</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading goal progress"
            className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700"
          >
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 transition-all duration-300" />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Set a reading goal to track progress</p>
        </div>
      </div>
    </DashboardCard>
  );
}

export default ReadingProgressWidget;
