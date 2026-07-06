import type { MarketingSummary } from '../../types/marketing.types';
import type { CouponPerformance } from '../../types/marketing.types';

interface MarketingPanelProps {
  summary: MarketingSummary | null | undefined;
  coupons: CouponPerformance[];
}

export function MarketingPanel({ summary, coupons }: MarketingPanelProps) {
  if (!summary) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gold-400">Marketing & Campaigns</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="rounded border border-navy-700 p-3">
          <p className="text-xs text-gray-400">Clicks</p>
          <p className="text-white font-medium">{summary.totalClicks}</p>
        </div>
        <div className="rounded border border-navy-700 p-3">
          <p className="text-xs text-gray-400">Conversions</p>
          <p className="text-white font-medium">{summary.totalConversions}</p>
        </div>
        <div className="rounded border border-navy-700 p-3">
          <p className="text-xs text-gray-400">Revenue</p>
          <p className="text-white font-medium">₹{summary.totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded border border-navy-700 p-3">
          <p className="text-xs text-gray-400">Active Campaigns</p>
          <p className="text-white font-medium">{summary.activeCampaigns}</p>
        </div>
      </div>
      {coupons.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Coupon Performance</p>
          {coupons.map((c) => (
            <p key={c.couponCode} className="text-xs text-gray-300">
              {c.couponCode}: {c.uses} uses · ₹{c.revenue} · {c.conversionRate}% conv.
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
