import type { DashboardOverview } from '../types/workspace.types';

interface DashboardOverviewCardsProps {
  overview: DashboardOverview | null | undefined;
  isLoading?: boolean;
}

export function DashboardOverviewCards({ overview, isLoading }: DashboardOverviewCardsProps) {
  if (isLoading) {
    return <div className="text-sm text-gray-400">Loading dashboard...</div>;
  }
  if (!overview) return null;

  const cards = [
    { label: 'Total Books', value: overview.totalBooks },
    { label: 'Published', value: overview.publishedBooks },
    { label: 'Drafts', value: overview.draftBooks },
    { label: 'Total Reads', value: overview.totalReads },
    { label: 'Revenue', value: `₹${overview.totalRevenue.toLocaleString('en-IN')}` },
    { label: 'Pending Royalties', value: `₹${overview.pendingRoyalties.toLocaleString('en-IN')}` },
    { label: 'Followers', value: overview.followerCount },
    { label: 'Avg Rating', value: overview.averageRating.toFixed(1) },
    { label: 'Active Tasks', value: overview.activeTasks },
    { label: 'Upcoming Events', value: overview.upcomingEvents },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <p className="text-xs text-gray-400">{card.label}</p>
          <p className="text-lg font-semibold text-white mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
