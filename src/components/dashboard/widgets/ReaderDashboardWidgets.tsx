import { ContinueReadingWidget } from './ContinueReadingWidget';
import { MembershipStatusWidget } from './MembershipStatusWidget';
import { RecentBooksWidget } from './RecentBooksWidget';
import { ReadingProgressWidget } from './ReadingProgressWidget';
import { ReadingAnalyticsWidget } from './ReadingAnalyticsWidget';
import { LatestOrdersWidget } from './LatestOrdersWidget';
import { WishlistSummaryWidget } from './WishlistSummaryWidget';
import { NotificationsWidget } from './NotificationsWidget';
import { DashboardGreeting } from './DashboardGreeting';

export function ReaderDashboardWidgets() {
  return (
    <div className="space-y-6">
      <DashboardGreeting />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="md:col-span-2">
          <ContinueReadingWidget hero />
        </div>
        <MembershipStatusWidget />
        <RecentBooksWidget />
        <ReadingProgressWidget />
        <ReadingAnalyticsWidget />
        <LatestOrdersWidget />
        <WishlistSummaryWidget />
        <NotificationsWidget />
      </div>
    </div>
  );
}

export default ReaderDashboardWidgets;
