import { useCallback, useMemo, useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { mapEdgeFunctionInvokeError } from '../../../lib/edge-functions';
import { useInvalidatePeople } from '../hooks';
import type { PeopleUser } from '../types/people.types';
import { mapSuspendRestoreErrorToMessage } from './suspend-restore.errors';
import { getSuspendRestoreService } from './suspend-restore.service';
import type {
  BulkUserActionResult,
  PeopleSuspendRestoreDialogMode,
  RestoreUserFormValues,
  SuspendUserFormValues,
} from './suspend-restore.types';

export function usePeopleSuspendRestore(onComplete?: () => void) {
  const [mode, setMode] = useState<PeopleSuspendRestoreDialogMode>(null);
  const [targets, setTargets] = useState<PeopleUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkUserActionResult[]>([]);
  const [bulkProgress, setBulkProgress] = useState({ completed: 0, total: 0 });
  const { showToast } = useToast();
  const { invalidateEverything, invalidateDetail, invalidateTimelines } = useInvalidatePeople();
  const service = useMemo(() => getSuspendRestoreService(), []);

  const closeDialog = useCallback(() => {
    if (isSubmitting) return;
    setMode(null);
    setTargets([]);
    setBulkResults([]);
    setBulkProgress({ completed: 0, total: 0 });
  }, [isSubmitting]);

  const openSuspend = useCallback((users: PeopleUser[]) => {
    setTargets(users);
    setMode(users.length > 1 ? 'bulk-suspend' : 'suspend');
    setBulkResults([]);
    setBulkProgress({ completed: 0, total: users.length });
  }, []);

  const openRestore = useCallback((users: PeopleUser[]) => {
    setTargets(users);
    setMode(users.length > 1 ? 'bulk-restore' : 'restore');
    setBulkResults([]);
    setBulkProgress({ completed: 0, total: users.length });
  }, []);

  const invalidateAfterChange = useCallback(
    async (userIds: string[]) => {
      await Promise.all([
        invalidateEverything(),
        ...userIds.map((id) => invalidateDetail(id)),
        ...userIds.map((id) => invalidateTimelines(id)),
      ]);
      onComplete?.();
    },
    [invalidateDetail, invalidateEverything, invalidateTimelines, onComplete],
  );

  const suspendOne = useCallback(
    async (user: PeopleUser, values: SuspendUserFormValues): Promise<BulkUserActionResult> => {
      try {
        await service.suspendUser({
          userId: user.id,
          reason: values.reason,
          notes: values.notes || undefined,
          effectiveImmediately: values.effectiveImmediately,
        });
        return { user, success: true };
      } catch (error) {
        const message =
          (await mapEdgeFunctionInvokeError(error).catch(() => null)) ??
          mapSuspendRestoreErrorToMessage(error);
        return { user, success: false, message };
      }
    },
    [service],
  );

  const restoreOne = useCallback(
    async (user: PeopleUser, values: RestoreUserFormValues): Promise<BulkUserActionResult> => {
      try {
        await service.restoreUser({
          userId: user.id,
          notes: values.notes || undefined,
        });
        return { user, success: true };
      } catch (error) {
        const message =
          (await mapEdgeFunctionInvokeError(error).catch(() => null)) ??
          mapSuspendRestoreErrorToMessage(error);
        return { user, success: false, message };
      }
    },
    [service],
  );

  const submitSuspend = useCallback(
    async (values: SuspendUserFormValues) => {
      if (targets.length === 0) return;
      setIsSubmitting(true);
      setBulkResults([]);
      setBulkProgress({ completed: 0, total: targets.length });

      const results: BulkUserActionResult[] = [];
      for (let index = 0; index < targets.length; index += 1) {
        const result = await suspendOne(targets[index], values);
        results.push(result);
        setBulkResults([...results]);
        setBulkProgress({ completed: index + 1, total: targets.length });
      }

      const successCount = results.filter((item) => item.success).length;
      const failed = results.filter((item) => !item.success);

      if (successCount > 0) {
        await invalidateAfterChange(results.filter((item) => item.success).map((item) => item.user.id));
      }

      if (failed.length === 0) {
        showToast(
          targets.length === 1
            ? 'User suspended successfully'
            : `${successCount} users suspended successfully`,
        );
        closeDialog();
      } else if (successCount === 0) {
        showToast(failed[0]?.message ?? 'Unable to suspend user');
      } else {
        showToast(`${successCount} suspended, ${failed.length} failed`);
      }

      setIsSubmitting(false);
    },
    [closeDialog, invalidateAfterChange, showToast, suspendOne, targets],
  );

  const submitRestore = useCallback(
    async (values: RestoreUserFormValues) => {
      if (targets.length === 0) return;
      setIsSubmitting(true);
      setBulkResults([]);
      setBulkProgress({ completed: 0, total: targets.length });

      const results: BulkUserActionResult[] = [];
      for (let index = 0; index < targets.length; index += 1) {
        const result = await restoreOne(targets[index], values);
        results.push(result);
        setBulkResults([...results]);
        setBulkProgress({ completed: index + 1, total: targets.length });
      }

      const successCount = results.filter((item) => item.success).length;
      const failed = results.filter((item) => !item.success);

      if (successCount > 0) {
        await invalidateAfterChange(results.filter((item) => item.success).map((item) => item.user.id));
      }

      if (failed.length === 0) {
        showToast(
          targets.length === 1
            ? 'User restored successfully'
            : `${successCount} users restored successfully`,
        );
        closeDialog();
      } else if (successCount === 0) {
        showToast(failed[0]?.message ?? 'Unable to restore user');
      } else {
        showToast(`${successCount} restored, ${failed.length} failed`);
      }

      setIsSubmitting(false);
    },
    [closeDialog, invalidateAfterChange, restoreOne, showToast, targets],
  );

  return {
    mode,
    targets,
    isSubmitting,
    bulkResults,
    bulkProgress,
    openSuspend,
    openRestore,
    closeDialog,
    submitSuspend,
    submitRestore,
  };
}

export type UsePeopleSuspendRestoreReturn = ReturnType<typeof usePeopleSuspendRestore>;
