import { useCallback, useMemo, useRef, useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { mapEdgeFunctionInvokeError } from '../../../lib/edge-functions';
import { useInvalidatePeople } from '../hooks';
import type { PeopleUser } from '../types/people.types';
import { BULK_SYNC_POLL_MS } from './bulk-operations.constants';
import { mapBulkOperationErrorToMessage } from './bulk-operations.errors';
import { getBulkOperationsService } from './bulk-operations.service';
import type {
  BulkOperationPayload,
  BulkOperationProgress,
  BulkOperationType,
  BulkUserResult,
} from './bulk-operations.types';

const CHUNK_SIZE = 5;
const ASYNC_THRESHOLD = 25;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mergeProgress(
  existing: BulkOperationProgress,
  incoming: BulkOperationProgress,
): BulkOperationProgress {
  return {
    completed: existing.completed + incoming.completed,
    failed: existing.failed + incoming.failed,
    skipped: existing.skipped + incoming.skipped,
    total: existing.total,
    results: [...existing.results, ...incoming.results],
    currentUserId: incoming.currentUserId,
    currentUserName: incoming.currentUserName,
    cancelled: incoming.cancelled,
  };
}

export function usePeopleBulkOperations(onComplete?: () => void) {
  const [operation, setOperation] = useState<BulkOperationType | null>(null);
  const [targets, setTargets] = useState<PeopleUser[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<BulkOperationProgress>({
    completed: 0,
    failed: 0,
    skipped: 0,
    total: 0,
    results: [],
  });
  const cancelledRef = useRef(false);
  const { showToast } = useToast();
  const { invalidateEverything, invalidateDetail, invalidateStats, invalidateFilters, invalidateTimelines } =
    useInvalidatePeople();
  const service = useMemo(() => getBulkOperationsService(), []);

  const resetProgress = useCallback((total: number) => {
    setProgress({ completed: 0, failed: 0, skipped: 0, total, results: [] });
  }, []);

  const close = useCallback(() => {
    if (isRunning) return;
    setOperation(null);
    setTargets([]);
    resetProgress(0);
    cancelledRef.current = false;
  }, [isRunning, resetProgress]);

  const cancel = useCallback(async () => {
    cancelledRef.current = true;
    setProgress((prev) => ({ ...prev, cancelled: true }));
  }, []);

  const openOperation = useCallback(
    (op: BulkOperationType, users: PeopleUser[]) => {
      if (users.length === 0) return;
      cancelledRef.current = false;
      setOperation(op);
      setTargets(users);
      resetProgress(users.length);
    },
    [resetProgress],
  );

  const invalidateAfterBulk = useCallback(
    async (results: BulkUserResult[]) => {
      const successIds = results.filter((r) => r.status === 'success').map((r) => r.userId);
      await Promise.all([
        invalidateEverything(),
        invalidateStats(),
        invalidateFilters(),
        ...successIds.map((id) => invalidateDetail(id)),
        ...successIds.map((id) => invalidateTimelines(id)),
      ]);
      onComplete?.();
    },
    [invalidateDetail, invalidateEverything, invalidateFilters, invalidateStats, invalidateTimelines, onComplete],
  );

  const pollJob = useCallback(
    async (jobId: string): Promise<BulkOperationProgress | null> => {
      while (!cancelledRef.current) {
        const status = await service.getJobStatus(jobId);
        if (status.progress) {
          setProgress(status.progress);
        }
        if (status.status === 'completed' && status.progress) return status.progress;
        if (status.status === 'failed' || status.status === 'cancelled') {
          throw new Error(status.error ?? 'Bulk operation failed');
        }
        await sleep(BULK_SYNC_POLL_MS);
      }
      await service.cancelJob(jobId).catch(() => undefined);
      return null;
    },
    [service],
  );

  const runSyncChunks = useCallback(
    async (op: BulkOperationType, userIds: string[], payload: BulkOperationPayload) => {
      let aggregate: BulkOperationProgress = {
        completed: 0,
        failed: 0,
        skipped: 0,
        total: userIds.length,
        results: [],
      };

      for (let index = 0; index < userIds.length; index += CHUNK_SIZE) {
        if (cancelledRef.current) break;
        const chunk = userIds.slice(index, index + CHUNK_SIZE);
        const currentUser = targets.find((u) => u.id === chunk[0]);
        setProgress((prev) => ({
          ...prev,
          currentUserId: chunk[0],
          currentUserName: currentUser?.name ?? null,
        }));

        const response = await service.execute(op, chunk, payload);
        if (response.progress) {
          aggregate = mergeProgress(aggregate, response.progress);
          setProgress({ ...aggregate, currentUserId: chunk[chunk.length - 1], currentUserName: currentUser?.name ?? null });
        }
      }

      return { ...aggregate, cancelled: cancelledRef.current };
    },
    [service, targets],
  );

  const execute = useCallback(
    async (payload: BulkOperationPayload) => {
      if (!operation || targets.length === 0) return;
      setIsRunning(true);
      cancelledRef.current = false;
      resetProgress(targets.length);

      try {
        const userIds = targets.map((u) => u.id);
        let finalProgress: BulkOperationProgress;

        if (userIds.length > ASYNC_THRESHOLD) {
          const response = await service.execute(operation, userIds, payload);
          if (response.async && response.jobId) {
            const polled = await pollJob(response.jobId);
            if (!polled) {
              showToast('Bulk operation cancelled');
              setIsRunning(false);
              return;
            }
            finalProgress = polled;
          } else if (response.progress) {
            finalProgress = response.progress;
            setProgress(response.progress);
          } else {
            throw new Error('Unexpected bulk response');
          }
        } else {
          finalProgress = await runSyncChunks(operation, userIds, payload);
          setProgress(finalProgress);
        }

        const successCount = finalProgress.results.filter((r) => r.status === 'success').length;
        if (successCount > 0) await invalidateAfterBulk(finalProgress.results);

        if (finalProgress.cancelled) {
          showToast(`Cancelled — ${successCount} completed before cancel`);
        } else if (finalProgress.failed === 0 && finalProgress.skipped === 0) {
          showToast(`${successCount} users processed successfully`);
          close();
        } else {
          showToast(`${successCount} succeeded, ${finalProgress.failed} failed, ${finalProgress.skipped} skipped`);
        }
      } catch (error) {
        const message =
          (await mapEdgeFunctionInvokeError(error).catch(() => null)) ??
          mapBulkOperationErrorToMessage(error);
        showToast(message);
      } finally {
        setIsRunning(false);
      }
    },
    [close, invalidateAfterBulk, operation, pollJob, resetProgress, runSyncChunks, service, showToast, targets],
  );

  return {
    operation,
    targets,
    isRunning,
    progress,
    openOperation,
    execute,
    cancel,
    close,
  };
}

export type UsePeopleBulkOperationsReturn = ReturnType<typeof usePeopleBulkOperations>;
