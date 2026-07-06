import type { PlatformAdminDashboardOverview } from '../../types/dashboard.types';

interface DashboardOverviewCardsProps {
  overview: PlatformAdminDashboardOverview | null | undefined;
  isLoading?: boolean;
}

export function DashboardOverviewCards({ overview, isLoading }: DashboardOverviewCardsProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading dashboard...</div>;
  if (!overview) return null;

  const cards = [
    { label: 'Pending Tasks', value: overview.pendingTasks },
    { label: "Today's Queue", value: overview.todaysQueue },
    { label: 'Notifications', value: overview.unreadNotifications },
    { label: 'Calendar Events', value: overview.upcomingCalendar },
    { label: 'Content Pending', value: overview.departmentCounts.content ?? 0 },
    { label: 'Support Open', value: overview.departmentCounts.support ?? 0 },
    { label: 'Finance Pending', value: overview.departmentCounts.finance ?? 0 },
    { label: 'Paperback Queue', value: overview.departmentCounts.paperback ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4" role="region" aria-label="Dashboard overview">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <p className="text-xs text-gray-400">{card.label}</p>
          <p className="text-lg font-semibold text-white mt-1">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
