import { DashboardCard } from '../DashboardCard';
import { DashboardMetric, DashboardBrandLink } from './dashboardWidgetUi';

export function WishlistSummaryWidget() {
  return (
    <DashboardCard title="Wishlist Summary" ariaLabel="Wishlist summary widget">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <DashboardMetric label="Wishlist Count" value="—" />
          <DashboardMetric label="Books On Discount" value="—" />
        </div>
        <DashboardBrandLink to="/reader/wishlist">Open Wishlist</DashboardBrandLink>
      </div>
    </DashboardCard>
  );
}

export default WishlistSummaryWidget;
