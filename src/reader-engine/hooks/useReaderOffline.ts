import { useMutation } from '@tanstack/react-query';
import { useReaderUserId } from '../../reader/hooks/useReaderUserId';
import { useReaderEngineServices } from './useReaderEngineServices';
import { getDeviceId } from '../utils/device';
import type { DigitalFormat } from '../../types/database';

export function useReaderOffline(bookId: string) {
  const userId = useReaderUserId();
  const { offline } = useReaderEngineServices();

  const downloadMutation = useMutation({
    mutationFn: (format: DigitalFormat) =>
      offline.queueDownload({
        userId: userId!,
        bookId,
        format,
        deviceId: getDeviceId(),
      }),
  });

  const getCached = (format: DigitalFormat) => offline.getLocalCache(bookId, format);

  return {
    queueDownload: downloadMutation.mutateAsync,
    isDownloading: downloadMutation.isPending,
    getCached,
    pendingSyncItems: offline.getPendingSyncItems(),
  };
}
