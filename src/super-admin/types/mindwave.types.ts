export interface MindWaveProviderConfig {
  id: string;
  name: string;
  enabled: boolean;
  model: string;
}

export interface MindWaveUsageSnapshot {
  creditsUsed: number;
  creditsLimit: number;
  estimatedCost: number;
  requestsToday: number;
}

export interface MindWaveConfiguration {
  enabled: boolean;
  defaultProvider: string;
  maxCreditsPerAuthor: number;
  providers: MindWaveProviderConfig[];
  usage: MindWaveUsageSnapshot;
}
