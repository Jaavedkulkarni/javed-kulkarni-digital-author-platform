import type { DeviceInfo } from '../types/common';
import type { SyncPayload } from '../types/sync.types';

export class DeviceSync {
  private deviceInfo: DeviceInfo;

  constructor(deviceInfo: DeviceInfo) {
    this.deviceInfo = deviceInfo;
  }

  getDeviceInfo(): DeviceInfo {
    return { ...this.deviceInfo };
  }

  markSynced(): DeviceInfo {
    this.deviceInfo = {
      ...this.deviceInfo,
      lastSyncedAt: new Date().toISOString(),
    };
    return this.getDeviceInfo();
  }

  tagPayload<T extends Record<string, unknown>>(payload: T): T & { deviceId: string; syncedAt: string } {
    return {
      ...payload,
      deviceId: this.deviceInfo.deviceId,
      syncedAt: new Date().toISOString(),
    };
  }

  buildSyncPayload(
    entityType: SyncPayload['entityType'],
    entityId: string,
    bookId: string,
    userId: string,
    data: Record<string, unknown>
  ): SyncPayload {
    return {
      entityType,
      entityId,
      bookId,
      userId,
      updatedAt: new Date().toISOString(),
      deviceId: this.deviceInfo.deviceId,
      data,
    };
  }
}

export function createDeviceSync(deviceInfo: DeviceInfo): DeviceSync {
  return new DeviceSync(deviceInfo);
}
