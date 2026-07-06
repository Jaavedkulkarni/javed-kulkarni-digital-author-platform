import { getMindWaveConfig, updateMindWaveConfig, toggleProvider } from '../stores/mindwaveStore';
import type { MindWaveConfiguration } from '../types/mindwave.types';
import type { SuperAdminOperationResult } from '../types/common';

export class MindWaveConfigurationService {
  getConfig() { return getMindWaveConfig(); }
  update(updates: Partial<MindWaveConfiguration>): SuperAdminOperationResult<MindWaveConfiguration> {
    return { success: true, data: updateMindWaveConfig(updates) };
  }
  toggleProvider(id: string, enabled: boolean): SuperAdminOperationResult<MindWaveConfiguration> {
    return { success: true, data: toggleProvider(id, enabled) };
  }
}

export function createMindWaveConfigurationService(): MindWaveConfigurationService {
  return new MindWaveConfigurationService();
}
