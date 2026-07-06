import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useReaderUserId } from '../../reader/hooks/useReaderUserId';
import { readerEngineQueryKeys } from '../query/queryKeys';
import { useReaderEngineServices } from './useReaderEngineServices';
import { buildDeviceInfo, getDeviceId } from '../utils/device';
import { createDeviceSync } from '../engines/deviceSync';
import type { SyncPayload } from '../types/sync.types';

export function useReaderSync(bookId: string) {
  const userId = useReaderUserId();
  const { sync } = useReaderEngineServices();
  const queryClient = useQueryClient();
  const deviceSync = createDeviceSync(buildDeviceInfo());

  const syncMutation = useMutation({
    mutationFn: async (payloads: { local: SyncPayload[]; remote: SyncPayload[] }) => {
      const conflicts = sync.detectConflicts(payloads.local, payloads.remote);
      const resolved = payloads.local.map((local) => {
        const remote = payloads.remote.find((r) => r.entityId === local.entityId);
        if (!remote) return local;
        return sync.resolveConflict(local, remote);
      });
      return sync.mergeSyncResults(resolved, conflicts);
    },
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.bookmarks(userId, bookId) });
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.highlights(userId, bookId) });
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.notes(userId, bookId) });
        void queryClient.invalidateQueries({ queryKey: readerEngineQueryKeys.position(userId, bookId) });
      }
      deviceSync.markSynced();
    },
  });

  const buildPayload = useCallback(
    (
      entityType: SyncPayload['entityType'],
      entityId: string,
      data: Record<string, unknown>
    ): SyncPayload | null => {
      if (!userId) return null;
      return deviceSync.buildSyncPayload(entityType, entityId, bookId, userId, data);
    },
    [userId, bookId, deviceSync]
  );

  return {
    deviceId: getDeviceId(),
    buildPayload,
    sync: syncMutation.mutateAsync,
    isSyncing: syncMutation.isPending,
    lastResult: syncMutation.data,
  };
}
