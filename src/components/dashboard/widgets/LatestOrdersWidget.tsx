import { DashboardCard } from '../DashboardCard';
import { DashboardEmptyState } from './dashboardWidgetUi';

export function LatestOrdersWidget() {
  const orders: never[] = [];

  return (
    <DashboardCard title="Latest Orders" ariaLabel="Latest orders widget">
      {orders.length === 0 ? (
        <div className="space-y-3">
          <DashboardEmptyState message="No orders yet" />
          <ul className="space-y-2" aria-label="Order list placeholder">
            <li className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-3 dark:border-navy-700">
              <div className="min-w-0">
                <p className="text-sm text-gray-400 dark:text-gray-500">Order —</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">—</p>
              </div>
              <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-400 dark:border-navy-600 dark:text-gray-500">
                —
              </span>
              <button
                type="button"
                disabled
                aria-label="Invoice unavailable"
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 disabled:cursor-not-allowed dark:border-navy-600 dark:text-gray-500"
              >
                Invoice
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </DashboardCard>
  );
}

export default LatestOrdersWidget;
