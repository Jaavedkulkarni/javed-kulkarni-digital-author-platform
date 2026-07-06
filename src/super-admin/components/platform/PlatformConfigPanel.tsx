import type { PlatformConfigItem } from '../../types/config.types';

export function PlatformConfigPanel({ configs, isLoading }: { configs?: PlatformConfigItem[]; isLoading?: boolean }) {
  if (isLoading) return <p className="text-sm text-gray-400">Loading configuration...</p>;
  const grouped = (configs ?? []).reduce<Record<string, PlatformConfigItem[]>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});
  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <h3 className="text-sm font-medium text-white capitalize mb-2">{cat.replace('_', ' ')}</h3>
          <div className="space-y-1">
            {items.map((c) => (
              <div key={c.id} className="flex justify-between text-xs border border-navy-700 rounded px-3 py-2 bg-navy-800/30">
                <span className="text-gray-400">{c.key}</span>
                <span className="text-white">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
