import type { PublisherPerformanceMetrics } from '../../types/dashboard.types';

interface PerformanceOverviewPanelProps {
  metrics: PublisherPerformanceMetrics | null | undefined;
  isLoading?: boolean;
}

export function PerformanceOverviewPanel({ metrics, isLoading }: PerformanceOverviewPanelProps) {
  if (isLoading) return <div className="text-sm text-gray-400">Loading performance...</div>;
  if (!metrics) return null;

  const items = [
    { label: 'Completed Jobs', value: metrics.completedJobs },
    { label: 'Cancelled Jobs', value: metrics.cancelledJobs },
    { label: 'Delayed Jobs', value: metrics.delayedJobs },
    { label: 'Avg Production (days)', value: metrics.averageProductionDays },
    { label: 'Avg Quote', value: `₹${metrics.averageQuoteAmount.toLocaleString('en-IN')}` },
    { label: 'Win Ratio', value: `${(metrics.winRatio * 100).toFixed(0)}%` },
    { label: 'Quality Rating', value: metrics.qualityRating.toFixed(1) },
    { label: 'Delivery Rating', value: metrics.deliveryRating.toFixed(1) },
  ];

  return (
    <div className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
      <h3 className="text-sm font-medium text-white mb-3">Performance Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-gray-400">{item.label}</p>
            <p className="text-sm font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
