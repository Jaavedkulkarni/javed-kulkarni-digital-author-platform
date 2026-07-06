import type { MindWaveConfiguration } from '../types/mindwave.types';

let config: MindWaveConfiguration = {
  enabled: true,
  defaultProvider: 'stub',
  maxCreditsPerAuthor: 100,
  providers: [
    { id: 'stub', name: 'Stub Provider', enabled: true, model: 'mindwave-stub-v1' },
    { id: 'openai', name: 'OpenAI', enabled: false, model: 'gpt-4' },
  ],
  usage: { creditsUsed: 1250, creditsLimit: 10000, estimatedCost: 450, requestsToday: 89 },
};

export function getMindWaveConfig(): MindWaveConfiguration {
  return config;
}

export function updateMindWaveConfig(updates: Partial<MindWaveConfiguration>): MindWaveConfiguration {
  config = { ...config, ...updates };
  return config;
}

export function toggleProvider(id: string, enabled: boolean): MindWaveConfiguration {
  config = {
    ...config,
    providers: config.providers.map((p) => (p.id === id ? { ...p, enabled } : p)),
  };
  return config;
}
