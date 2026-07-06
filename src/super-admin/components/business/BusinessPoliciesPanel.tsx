import type { BusinessPolicy } from '../../types/business.types';

export function BusinessPoliciesPanel({ policies, isLoading }: { policies?: BusinessPolicy[]; isLoading?: boolean }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading policies...</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {(policies ?? []).map((p) => (
        <div key={p.id} className="rounded-lg border border-navy-700 bg-navy-800/50 p-4">
          <p className="text-xs text-gold-400 capitalize">{p.category.replace('_', ' ')}</p>
          <p className="text-sm text-white mt-1">{p.name}</p>
          <p className="text-lg font-semibold text-white mt-1">{p.value}</p>
        </div>
      ))}
    </div>
  );
}
