import { ContinueReadingWidget } from './ContinueReadingWidget';
import { MembershipStatusWidget } from './MembershipStatusWidget';
import { RecentBooksWidget } from './RecentBooksWidget';
import { ReadingProgressWidget } from './ReadingProgressWidget';
import { ReadingAnalyticsWidget } from './ReadingAnalyticsWidget';
import { LatestOrdersWidget } from './LatestOrdersWidget';
import { WishlistSummaryWidget } from './WishlistSummaryWidget';
import { NotificationsWidget } from './NotificationsWidget';
import { DashboardGreeting } from './DashboardGreeting';
import { useRoles as useOrgRoles } from '../../../organization/hooks/useRoles';
import { resolveActiveDashboardSurfaces } from '../../../lib/navigationArchitecture';

export function ReaderDashboardWidgets() {
  const { roles, assignments, roleContext } = useOrgRoles();
  const surfaces = resolveActiveDashboardSurfaces({
    systemRoles: roles,
    assignments,
    authRoles: roleContext?.authRoles,
  });

  const showReaderWidgets = surfaces.includes('reader');

  if (!showReaderWidgets) {
    return (
      <div className="space-y-6">
        <DashboardGreeting />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reader dashboard widgets appear when the Reader role is assigned.
        </p>
      </div>
    );
  }

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
