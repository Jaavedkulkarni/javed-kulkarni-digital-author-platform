import { DashboardCard } from '../DashboardCard';
import { DashboardMetric } from './dashboardWidgetUi';

export function ReadingAnalyticsWidget() {
  return (
    <DashboardCard title="Reading Analytics" ariaLabel="Reading analytics widget">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardMetric label="Pages Read" value="—" />
        <DashboardMetric label="Reading Hours" value="—" />
        <DashboardMetric label="Current Reading Streak" value="—" />
      </div>
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Reading analytics will appear once you start reading
      </p>
    </DashboardCard>
  );
}

export default ReadingAnalyticsWidget;
