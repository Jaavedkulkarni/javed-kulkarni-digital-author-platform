import type { PublisherDashboardOverview } from '../../types/dashboard.types';

interface PublisherDashboardOverviewCardsProps {
  overview: PublisherDashboardOverview | null | undefined;
  isLoading?: boolean;
}

export function PublisherDashboardOverviewCards({
  overview,
  isLoading,
}: PublisherDashboardOverviewCardsProps) {
  if (isLoading) {
    return <div className="text-sm text-gray-400">Loading dashboard...</div>;
  }
  if (!overview) return null;

  const cards = [
    { label: "Today's Jobs", value: overview.todaysProductionJobs },
    { label: 'Pending Quotations', value: overview.pendingQuotations },
    { label: 'Submitted Quotes', value: overview.submittedQuotations },
    { label: 'Won Quotes', value: overview.wonQuotations },
    { label: 'Lost Quotes', value: overview.lostQuotations },
    { label: 'Production Queue', value: overview.productionQueue },
    { label: 'Ready For Dispatch', value: overview.readyForDispatch },
    { label: 'Dispatched', value: overview.dispatched },
    { label: 'Delivered', value: overview.delivered },
    { label: 'Completed', value: overview.completedJobs },
    { label: 'Cancelled', value: overview.cancelledJobs },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <p className="text-xs text-gray-400">{card.label}</p>
          <p className="text-lg font-semibold text-white mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
