import type { SyncPayload, SyncConflict, SyncResult } from '../types/sync.types';
import { SYNC_CONFLICT_STRATEGY } from '../constants/readerEngine.constants';

export class SyncEngine {
  resolveConflict(local: SyncPayload, remote: SyncPayload): SyncPayload {
    if (SYNC_CONFLICT_STRATEGY === 'last_write_wins') {
      return new Date(local.updatedAt) >= new Date(remote.updatedAt) ? local : remote;
    }
    return local;
  }

  detectConflicts(localItems: SyncPayload[], remoteItems: SyncPayload[]): SyncConflict[] {
    const conflicts: SyncConflict[] = [];
    const remoteMap = new Map(remoteItems.map((r) => [r.entityId, r]));

    for (const local of localItems) {
      const remote = remoteMap.get(local.entityId);
      if (!remote) continue;
      if (local.updatedAt !== remote.updatedAt && local.deviceId !== remote.deviceId) {
        conflicts.push({
          entityType: local.entityType,
          entityId: local.entityId,
          localUpdatedAt: local.updatedAt,
          remoteUpdatedAt: remote.updatedAt,
          localDeviceId: local.deviceId,
          remoteDeviceId: remote.deviceId,
        });
      }
    }
    return conflicts;
  }

  mergeSyncResults(
    synced: SyncPayload[],
    conflicts: SyncConflict[]
  ): SyncResult {
    return {
      synced: synced.length,
      conflicts,
      failed: 0,
    };
  }
}

export function createSyncEngine(): SyncEngine {
  return new SyncEngine();
}
