import type { MindWaveConfiguration } from '../../types/mindwave.types';

export function MindWaveConfigPanel({
  config,
  isLoading,
  onToggle,
}: {
  config?: MindWaveConfiguration;
  isLoading?: boolean;
  onToggle?: (id: string, enabled: boolean) => void;
}) {
  if (isLoading || !config) return <p className="text-sm text-gray-400">Loading MindWave configuration...</p>;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-navy-700 bg-navy-800/50 p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div><p className="text-xs text-gray-400">Status</p><p className="text-white">{config.enabled ? 'Enabled' : 'Disabled'}</p></div>
        <div><p className="text-xs text-gray-400">Credits Used</p><p className="text-white">{config.usage.creditsUsed} / {config.usage.creditsLimit}</p></div>
        <div><p className="text-xs text-gray-400">Est. Cost</p><p className="text-white">₹{config.usage.estimatedCost}</p></div>
        <div><p className="text-xs text-gray-400">Requests Today</p><p className="text-white">{config.usage.requestsToday}</p></div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-white mb-2">Providers (Configuration Only)</h3>
        {config.providers.map((p) => (
          <div key={p.id} className="flex justify-between items-center border border-navy-700 rounded px-3 py-2 mb-2 bg-navy-800/30">
            <div>
              <p className="text-sm text-white">{p.name}</p>
              <p className="text-xs text-gray-500">{p.model}</p>
            </div>
            {onToggle && (
              <button type="button" onClick={() => onToggle(p.id, !p.enabled)} className={`text-xs ${p.enabled ? 'text-green-400' : 'text-gray-500'}`}>
                {p.enabled ? 'Enabled' : 'Disabled'}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-600">MindWave AI — configuration only. No AI runtime in this module.</p>
    </div>
  );
}
