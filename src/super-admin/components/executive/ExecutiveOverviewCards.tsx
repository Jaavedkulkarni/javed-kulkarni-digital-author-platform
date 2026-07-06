import type { ExecutiveDashboardOverview } from '../../types/executive.types';

export function ExecutiveOverviewCards({ overview, isLoading }: { overview?: ExecutiveDashboardOverview; isLoading?: boolean }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading executive dashboard...</p>;
  if (!overview) return null;

  const healthColor = overview.platformHealth === 'healthy' ? 'text-green-400' : overview.platformHealth === 'degraded' ? 'text-amber-400' : 'text-red-400';

  const cards = [
    { label: 'Platform Health', value: overview.platformHealth, className: healthColor },
    { label: "Today's Revenue", value: `₹${overview.todaysRevenue.toLocaleString('en-IN')}` },
    { label: 'Monthly Revenue', value: `₹${overview.monthlyRevenue.toLocaleString('en-IN')}` },
    { label: 'Books Sold', value: overview.booksSold },
    { label: 'Orders', value: overview.orders },
    { label: 'Memberships', value: overview.memberships },
    { label: 'Readers', value: overview.readers.toLocaleString('en-IN') },
    { label: 'Authors', value: overview.authors },
    { label: 'Publishers', value: overview.publishers },
    { label: 'Platform Admins', value: overview.platformAdmins },
    { label: 'Pending Reviews', value: overview.pendingReviews },
    { label: 'Publisher Approvals', value: overview.pendingPublisherApprovals },
    { label: 'Pending Withdrawals', value: overview.pendingWithdrawals },
    { label: 'Support Queue', value: overview.supportQueue },
    { label: 'Paperback Production', value: overview.paperbackProduction },
    { label: 'Storage', value: `${overview.storageUsageGb} / ${overview.storageLimitGb} GB` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4" role="region" aria-label="Executive overview">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <p className="text-xs text-gray-400">{c.label}</p>
          <p className={`text-lg font-semibold mt-1 capitalize ${c.className ?? 'text-white'}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
