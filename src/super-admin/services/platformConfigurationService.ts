import { getPlatformConfig, updateConfig } from '../stores/configStore';
import type { SuperAdminOperationResult } from '../types/common';

export class PlatformConfigurationService {
  list() { return getPlatformConfig(); }
  getByCategory(category: Parameters<typeof getPlatformConfig>[0]) { return getPlatformConfig(category); }
  update(id: string, value: string): SuperAdminOperationResult {
    const r = updateConfig(id, value);
    return r ? { success: true, data: r } : { success: false, errors: ['Not found'] };
  }
}

export function createPlatformConfigurationService(): PlatformConfigurationService {
  return new PlatformConfigurationService();
}
