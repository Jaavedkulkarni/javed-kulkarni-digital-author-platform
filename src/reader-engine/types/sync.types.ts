export type SyncEntityType = 'bookmark' | 'highlight' | 'note' | 'position' | 'progress';

export type SyncConflictStrategy = 'last_write_wins' | 'device_priority' | 'merge';

export interface SyncPayload {
  entityType: SyncEntityType;
  entityId: string;
  bookId: string;
  userId: string;
  updatedAt: string;
  deviceId: string;
  data: Record<string, unknown>;
}

export interface SyncConflict {
  entityType: SyncEntityType;
  entityId: string;
  localUpdatedAt: string;
  remoteUpdatedAt: string;
  localDeviceId: string;
  remoteDeviceId: string;
}

export interface SyncResult {
  synced: number;
  conflicts: SyncConflict[];
  failed: number;
}
