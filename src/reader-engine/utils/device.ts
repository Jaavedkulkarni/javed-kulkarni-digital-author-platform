import type { DeviceInfo } from '../types/common';

export function getDeviceId(): string {
  const key = 'authoros_device_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export function buildDeviceInfo(): DeviceInfo {
  return {
    deviceId: getDeviceId(),
    platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
    appVersion: '1.0.0',
    lastSyncedAt: null,
  };
}
