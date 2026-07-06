import type { AnalyticsSnapshot } from '../../types/analytics.types';

export function AnalyticsPanel({ snapshot, isLoading }: { snapshot?: AnalyticsSnapshot; isLoading?: boolean }) {
  if (isLoading || !snapshot) return <p className="text-sm text-gray-400">Loading analytics...</p>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-navy-700 bg-navy-800/50 p-4"><p className="text-xs text-gray-400">Revenue Growth</p><p className="text-white text-lg">{snapshot.revenue.growth}%</p></div>
        <div className="rounded-lg border border-navy-700 bg-navy-800/50 p-4"><p className="text-xs text-gray-400">Conversion</p><p className="text-white text-lg">{snapshot.conversion.rate}%</p></div>
        <div className="rounded-lg border border-navy-700 bg-navy-800/50 p-4"><p className="text-xs text-gray-400">Books Published</p><p className="text-white text-lg">{snapshot.books.published}</p></div>
        <div className="rounded-lg border border-navy-700 bg-navy-800/50 p-4"><p className="text-xs text-gray-400">Membership Churn</p><p className="text-white text-lg">{snapshot.membership.churn}%</p></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-navy-700 bg-navy-800/30 p-4">
          <h4 className="text-xs text-gold-400 mb-2">Top Countries</h4>
          {snapshot.topCountries.map((c) => <p key={c.country} className="text-xs text-gray-400">{c.country}: {c.users}</p>)}
        </div>
        <div className="rounded-lg border border-navy-700 bg-navy-800/30 p-4">
          <h4 className="text-xs text-gold-400 mb-2">Languages</h4>
          {snapshot.topLanguages.map((l) => <p key={l.language} className="text-xs text-gray-400">{l.language}: {l.share}%</p>)}
        </div>
        <div className="rounded-lg border border-navy-700 bg-navy-800/30 p-4">
          <h4 className="text-xs text-gold-400 mb-2">Devices</h4>
          {snapshot.devices.map((d) => <p key={d.device} className="text-xs text-gray-400">{d.device}: {d.share}%</p>)}
        </div>
      </div>
    </div>
  );
}
